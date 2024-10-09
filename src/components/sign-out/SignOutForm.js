import { useFetch } from "../../hooks/useFetch";

export default function SignOutForm({url, setCustomerFirstName, setCustomerLastName, setCustomerEmail, setCustomerPhone, handleSignOut}) {

    
    return (
    <form>
      <label>
        <h1 className="font-bold">Customer Information</h1>
      </label>
      <div className="flex flex-col">
        <input
          type="text"
          placeholder="First Name"
          className="input input-bordered w-full my-6"
          onChange={(e) => setCustomerFirstName(e.target.value)} 
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="input input-bordered w-full mb-6"
          onChange={(e) => setCustomerLastName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Email"
          className="input input-bordered w-full mb-6"
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="input input-bordered w-full mb-6"
          onChange={(e) => setCustomerPhone(e.target.value)}
          required
        />
      </div>
      <button className="btn bg-indigo-950 text-white mt-5" type="submit" onClick={handleSignOut}>
        Submit
      </button>
    </form>
  );
}
