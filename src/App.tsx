import axios from 'axios';
import {useState} from 'react';
import './App.css';
import {CalculateMortgageRequestTO} from './types/CalculateMortgageRequestTO';
import {CalculateMortgageResponseTO} from './types/CalculateMortgageResponseTO';
import {PaymentSchedule} from './types/PaymentSchedule';

const App = () => {

  const [propertyPriceInput, setPropertyPrice] = useState<String>("");
  const [downPaymentInput, setDownPayment] = useState<String>("");
  const [annualInterestRatePercentageInput, setAnnualInterestRatePercentage] = useState<String>("");
  const [amortizationPeriod, setAmortizationPeriod] = useState<number>(25);
  const [paymentSchedule, setPaymentSchedule] = useState<PaymentSchedule>(PaymentSchedule.MONTHLY);

  const [calculateRequest, setCalculateRequest] = useState<undefined | CalculateMortgageRequestTO>(undefined);
  const [calculateResponse, setCalculateResponse] = useState<undefined | CalculateMortgageResponseTO>(undefined);

  const [error, setError] = useState<string | undefined>(undefined);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Convert propertyPrice, downPayment, and annualInterestRatePercentage to numbers
    if (isNaN(Number(propertyPriceInput))) {
      setError('Property price must be a number');
      return;
    } else {
      setError(undefined);
    }

    const propertyPrice = Number(propertyPriceInput);

    if (!propertyPriceInput || propertyPrice <= 0) {
      setError('Property price must be greater than 0');
      return;
    }

    if (!downPaymentInput) {
      setError('Down payment must be greater than 0');
      return;
    }

    if (isNaN(Number(downPaymentInput))) {
      setError('Down payment must be a number');
      return;
    } else {
      setError(undefined);
    }

    const downPayment = Number(downPaymentInput);

    if (downPayment <= 0) {
      setError('Down payment must be greater than 0');
      return;
    }



    if (isNaN(Number(annualInterestRatePercentageInput))) {
      setError('Annual interest rate percentage must be a number');
      return;
    } else {
      setError(undefined);
    }

    const annualInterestRatePercentage = Number(annualInterestRatePercentageInput);

    if (!annualInterestRatePercentageInput || annualInterestRatePercentage <= 0) {
      setError('Annual interest rate percentage must be greater than 0');
      return;
    }

    // If down payment is less than 5% of property price, show an error
    if (downPayment < propertyPrice * 0.05) {
      setError('Down payment must be at least 5% of property price');
      return;
    }

    // If down payment is greater than property price, show an error
    if (downPayment > propertyPrice) {
      setError('Down payment cannot be greater than property price');
      return;
    }

    setError(undefined);

    // Create a new request object
    const request: CalculateMortgageRequestTO = {
      propertyPrice,
      downPayment,
      annualInterestRatePercentage,
      amortizationPeriod,
      paymentSchedule
    };

    const url = process.env["REACT_APP_API_URL"] + '/api/mortgage/calculate';

    setCalculateRequest(request);
    try {
      const res = await axios.post<CalculateMortgageResponseTO>(url, request);
      console.log(res.data);
      setCalculateResponse(res.data);
    } catch (e: any) {
      console.error(e);
      alert('Error: ' + e["errors"]);
    }
  }


  return (
    <div className='app'>
      <div className='left'>
        <div className='left-container'>
          <div className='title'>Payment Size</div>
          <div className='number'>{calculateResponse?.paymentPerScheule ? "$" + calculateResponse.paymentPerScheule : "?"}</div>
        </div>
      </div>
      <div className='right'>
        {/* Create a form for each field */}
        <div className='form-container'>
          <div>Mortgage Payment Calculator</div>
          <form onSubmit={handleSubmit}>
            <label>
              Property Price:
              <input onChange={(e) => setPropertyPrice(e.target.value)} placeholder='ex: 500000' />
            </label>
            <label>
              Down Payment:
              <input onChange={(e) => setDownPayment(e.target.value)} placeholder='ex: 200000' />
            </label>
            <label>
              Annual Interest Rate Percentage: %
              <input onChange={(e) => setAnnualInterestRatePercentage(e.target.value)} placeholder='ex: 5.2%' />
            </label>
            <label>
              Amortization Period:
              <select value={amortizationPeriod} onChange={(e) => setAmortizationPeriod(Number(e.target.value))}>
                <option value={5}>5 Years</option>
                <option value={10}>10 Years</option>
                <option value={15}>15 Years</option>
                <option value={20}>20 Years</option>
                <option value={25}>25 Years</option>
                <option value={30}>30 Years</option>
              </select>
            </label>
            <label>
              Payment Schedule:
              <select value={paymentSchedule} onChange={(e) => setPaymentSchedule(PaymentSchedule[e.target.value as keyof typeof PaymentSchedule])}>
                <option value={PaymentSchedule.MONTHLY}>{PaymentSchedule.MONTHLY}</option>
                <option value={PaymentSchedule.BIWEEKLY}>{PaymentSchedule.BIWEEKLY}</option>
                <option value={PaymentSchedule.ACCELERATED_BIWEEKLY}>{PaymentSchedule.ACCELERATED_BIWEEKLY}</option>
              </select>
            </label>
            <div className='error'>{error}</div>
            <button type='submit'>Calculate</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
