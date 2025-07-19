import { useEffect, useState } from "react";

import "./App.css";
import NUMBERS from "./constants/number";

function App() {
  const [loanValue, setLoanValue] = useState(NUMBERS.FIFTEEN_LACK);
  const [loanTenure, setLoanTenure] = useState(NUMBERS.ONE_FIFTY);
  const [interestRate, setInterestRate] = useState(NUMBERS.SEVENTEEN);
  const [emiPaid, setEmiPaid] = useState(NUMBERS.THIRTY);
  const [isAfterMoratorium, setIsAfterMoratorium] = useState(true);
  const [isMonthlyCredit, setIsMonthlyCredit] = useState(false);
  const [notAvailed, setNotAvailed] = useState(false);
  const [firstMonth, setFirstMonth] = useState(false);
  const [secondMonth, setSecondMonth] = useState(false);
  const [thirdMonth, setThirdMonth] = useState(true);
  const [interestValue, setInterestValue] = useState(NUMBERS.ZERO);

  // this function is used to parse inr string rupess to convert into plain number
  const parseINR = (str) => {
    const plain = str.replace(/,/g, "");
    const num = Number(plain);
    return isNaN(num) ? loanValue : num;
  };

  // this function is used to set input values for loan amount
  const handleInputChange = (e) => {
    const newValue = parseINR(e.target.value);
    if (
      !isNaN(newValue) &&
      newValue >= NUMBERS.ZERO &&
      newValue <= NUMBERS.TEN_CRORE
    ) {
      setLoanValue(newValue);
    }
  };

  // this function is used to format the numbers into indian rupees format
  const formatINR = (num) =>
    num.toLocaleString("en-IN", {
      maximumFractionDigits: NUMBERS.ZERO,
    });

  // this function is used to calculate emi
  const handeleEmicalculate = (P, r, n) => {
    return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  };

  // this function is used to find outstanding principal
  const handleOutstandingPrincipal = (P, r, n, emiPaid) => {
    const emi = handeleEmicalculate(P, r, n);
    return (
      P * Math.pow(1 + r, emiPaid) - emi * ((Math.pow(1 + r, emiPaid) - 1) / r)
    );
  };

  // this function is used to calculate interest
  const handleInterestCalculate = () => {
    const annualRate = interestRate / NUMBERS.HUNDRED;
    const monthlyRate = annualRate / NUMBERS.TWELVE;
    const P = loanValue;
    const N = loanTenure;
    const T = notAvailed
      ? 0
      : firstMonth
      ? 1
      : secondMonth
      ? 2
      : thirdMonth
      ? 3
      : 0;

    const outstandingPrincipal = handleOutstandingPrincipal(
      P,
      monthlyRate,
      N,
      emiPaid
    );

    let moratoriumInterest = 0;

    if (isAfterMoratorium) {
      moratoriumInterest = outstandingPrincipal * monthlyRate * T; // simple
    } else if (isMonthlyCredit) {
      moratoriumInterest =
        outstandingPrincipal * (Math.pow(1 + monthlyRate, T) - 1); // compound
    }

    setInterestValue(Math.round(moratoriumInterest));
  };

  // this function is used to calculate interest value dynamically on basis of state value change
  useEffect(() => {
    handleInterestCalculate();
  }, [
    loanValue,
    loanTenure,
    interestRate,
    emiPaid,
    isAfterMoratorium,
    isMonthlyCredit,
    notAvailed,
    firstMonth,
    secondMonth,
    thirdMonth,
  ]);
  return (
    <div className="app">
      <div className="main-app">
        {/*header*/}
        <div className="header-section">
          <div className="header-box">
            <span>Moratorium Option Calculator</span>
          </div>
        </div>

        {/*laon amount section*/}
        <div className="loan-container">
          <h4>Loan Amount ( in ₹ )</h4>
          <input
            type="text"
            min={NUMBERS.ZERO}
            max={NUMBERS.TEN_CRORE}
            onChange={(e) => handleInputChange(e)}
            id="loan-input"
            value={formatINR(loanValue)}
            step={NUMBERS.TWENTY_FIVE_THOUSANDS}
          ></input>
        </div>

        {/* slider section*/}
        <div className="slider">
          <input
            className="slider-input"
            type="range"
            min={NUMBERS.ZERO}
            max={NUMBERS.TEN_CRORE}
            step={NUMBERS.TWENTY_FIVE_THOUSANDS}
            value={loanValue}
            onChange={(e) => setLoanValue(Number(e.target.value))}
          />
        </div>

        {/* loan-container-section */}
        <div className="loan-container-details-box">
          <div className="loan-box">
            <p>Total Loan Tenure (in Months)</p>
            <input
              type="number"
              name="detail-input"
              className="detail-input"
              value={loanTenure}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
            ></input>
          </div>
          <div className="loan-box">
            <p>Interest rate (%)</p>
            <input
              type="number"
              name="detail-input"
              step="0.25"
              className="detail-input"
              value={interestRate.toFixed(2)}
              onChange={(e) => setInterestRate(Number(e.target.value))}
            ></input>
          </div>
          <div className="loan-box">
            <p>EMIs Paid till date (in months)</p>
            <input
              type="number"
              name="detail-input"
              className="detail-input"
              value={emiPaid}
              onChange={(e) => setEmiPaid(Number(e.target.value))}
            ></input>
          </div>
        </div>

        {/* compound interest section*/}
        <div className="compound-interest-section">
          <h4>Compound Interest Option</h4>
          <div className="compound-button-section">
            <button
              className={`${isAfterMoratorium ? "active" : ""}`}
              onClick={() => {
                setIsAfterMoratorium(true);
                setIsMonthlyCredit(false);
              }}
            >
              After Moratorium Period
            </button>
            <button
              className={`${isMonthlyCredit ? "active" : ""}`}
              onClick={() => {
                setIsAfterMoratorium(false);
                setIsMonthlyCredit(true);
              }}
            >
              Monthly (Like Credit Cards)
            </button>
          </div>
        </div>

        {/* moratorium months section */}
        <div className="compound-interest-section">
          <h4>Moratorium Months</h4>
          <div className="moratorium-button-section">
            <button
              className={`${notAvailed ? "active" : ""}`}
              onClick={() => {
                setNotAvailed(true);
                setFirstMonth(false);
                setSecondMonth(false);
                setThirdMonth(false);
              }}
            >
              Not Availed
            </button>
            <button
              className={`${firstMonth ? "active" : ""}`}
              onClick={() => {
                setNotAvailed(false);
                setFirstMonth(true);
                setSecondMonth(false);
                setThirdMonth(false);
              }}
            >
              1
            </button>
            <button
              className={`${secondMonth ? "active" : ""}`}
              onClick={() => {
                setNotAvailed(false);
                setFirstMonth(false);
                setSecondMonth(true);
                setThirdMonth(false);
              }}
            >
              2
            </button>
            <button
              className={`${thirdMonth ? "active" : ""}`}
              onClick={() => {
                setNotAvailed(false);
                setFirstMonth(false);
                setSecondMonth(false);
                setThirdMonth(true);
              }}
            >
              3
            </button>
          </div>
        </div>

        {/* interest count section */}
        <div className="interest-count-section">
          <div className="interest-text">Interest Overdue after 3 months</div>
          <div className="interest-price">₹ {formatINR(interestValue)}</div>
        </div>

        {/* calculate button section */}
        <div className="calculate-btn-section">
          <button onClick={handleInterestCalculate}>CALCULATE</button>
          <p>COVID 19 - Stay Inside Stay Safe</p>
        </div>
      </div>
    </div>
  );
}

export default App;
