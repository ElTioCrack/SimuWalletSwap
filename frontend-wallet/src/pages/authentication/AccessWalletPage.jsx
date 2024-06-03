import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import PasswordInput from "../../components/inputs/PasswordInput";

import { useAuth } from "../../auth/AuthProvider";

import { decryptData, generateSecretKey } from "../../utils/cryptoUtils.jsx";

import { AccessWalletService } from "../../services/WalletServices.jsx";

function AccessWalletPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const totalWords = 12;
  const [recoveryPhrase, setRecoveryPhrase] = useState(Array(totalWords).fill(""));
  const passwordRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePaste = () => {
    navigator.clipboard.readText().then((text) => {
      const words = text.split(" ");
      if (words.length === totalWords) {
        setRecoveryPhrase(words);
      } else {
        alert(`Please make sure you have exactly ${totalWords} words in your clipboard.`);
      }
    });
  };

  const handleInputChange = (index, value) => {
    const newPhrase = [...recoveryPhrase];
    newPhrase[index] = value;
    setRecoveryPhrase(newPhrase);
  };

  const validateInputs = () => {
    if (recoveryPhrase.every(word => word !== "")) {
      setStep(2);
      setErrorMessage("");
    } else {
      setErrorMessage("Please complete all 12 words of the recovery phrase.");
    }
  };

  const downloadRecoveryPhrase = () => {
    const phraseToDownload = recoveryPhrase.join(" ");
    const element = document.createElement("a");
    const file = new Blob([phraseToDownload], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "recovery_phrase.txt";
    document.body.appendChild(element);
    element.click();
  };

  const uploadRecoveryPhrase = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const words = text.split(" ");
      if (words.length === totalWords) {
        setRecoveryPhrase(words);
      } else {
        alert(`Please make sure the file contains exactly ${totalWords} words.`);
      }
    };
    reader.readAsText(file);
  };

  const handleAccessWallet = async () => {
    try {
      const mnemonic = recoveryPhrase.join(" ");
      const password = passwordRef.current.getValue();
      const secretKey = generateSecretKey(password);
      const decryptedMnemonic = await decryptData(mnemonic, secretKey);

      const response = await AccessWalletService(decryptedMnemonic);

      if (response.success) {
        login(response.data.accessToken, response.data.refreshToken);
        navigate("/wallet");
      } else {
        alert("Error accessing wallet: " + response.message);
      }
    } catch (error) {
      alert("Error accessing wallet:");
      console.error("Error accessing wallet:", error);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
      <div
        className="my-6 p-6 rounded-xl shadow-md bg-white"
        style={{ width: "400px" }}
      >
        <h1 className="text-center rounded-xl text-4xl font-bold select-none">
          Access Wallet
        </h1>
        <h2 className="my-3 text-center text-2xl font-bold select-none">
          Step {step} of 2:
        </h2>

        {/* Start div cambiante */}
        {step === 1 && (
          <>
            <p className="text-center select-none">
              Enter your recovery phrase to access your wallet.
            </p>

            <div className="my-3 p-4 flex flex-col justify-center rounded-md bg-gray-200">
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: totalWords }).map((_, index) => (
                  <div key={index} className="flex justify-between">
                    <label
                      htmlFor={`word-${index + 1}`}
                      className="w-8 select-none"
                    >
                      {index + 1}.
                    </label>
                    <input
                      type="text"
                      id={`word-${index + 1}`}
                      className="p-1 font-semibold border-b border-gray-400 focus:outline-none focus:border-indigo-500 w-full"
                      placeholder={`Word ${index + 1}`}
                      value={recoveryPhrase[index]}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      autoComplete="off"
                    />
                  </div>
                ))}
              </div>
              <hr className="border-t-2 border-white my-4" />
              <div className="col-span-3 flex justify-around select-none">
                <button
                  className="font-bold p-2 rounded-md border border-white bg-indigo-100 hover:bg-indigo-300 text-indigo-600"
                  style={{ width: "120px" }}
                  onClick={handlePaste}
                >
                  Paste Phrase
                </button>
                <label
                  className="p-2 font-bold text-center rounded-md border border-white bg-indigo-100 hover:bg-indigo-300 text-indigo-600"
                  style={{ width: "120px" }}
                  htmlFor="fileInput"
                >
                  Upload
                </label>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  onChange={uploadRecoveryPhrase}
                />
              </div>
              {errorMessage && (
                <div className="mt-2 text-red-500 text-center">
                  {errorMessage}
                </div>
              )}
            </div>

            <div className="mt-2 flex justify-evenly select-nsone bg-white">
              <Link className="p-2 rounded-xl border border-indigo-500" to="/">
                Back
              </Link>
              <button
                className="p-2 rounded-xl bg-indigo-500 text-white"
                onClick={validateInputs}
              >
                Next Step
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <p className="text-center select-none">
              Enter your wallet password to access your wallet.
            </p>

            <form>
              <div className="my-3 p-4 flex flex-col justify-center rounded-md bg-gray-200">
                <PasswordInput
                  ref={passwordRef}
                  id="password"
                  label="Password"
                  placeholder="Enter your password"
                />

                {errorMessage && (
                  <>
                    <hr className="border-t-2 border-white my-4" />
                    <p className="text-red-500">{errorMessage}</p>
                  </>
                )}
              </div>

              <div className="mt-2 flex justify-evenly select-nsone bg-white">
                <button
                  className="p-2 rounded-xl border border-indigo-500"
                  type="button"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button
                  className="p-2 rounded-xl bg-indigo-500 text-white"
                  type="button"
                  onClick={handleAccessWallet}
                >
                  Access Wallet
                </button>
              </div>
            </form>
          </>
        )}

        {/* End div cambiante */}
      </div>

      <div className="select-none">
        Don't have a wallet?{" "}
        <Link
          to="/createwallet"
          className="underline font-bold text-indigo-500 hover:text-indigo-800"
        >
          Create it here
        </Link>
      </div>
      <div className="select-none">
        <Link
          to="/"
          className="underline font-bold text-indigo-500 hover:text-indigo-800"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default AccessWalletPage;
