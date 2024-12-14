export default function SignOutForm({ setNewCustomerData, handleSignOut }) {
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
          onChange={(e) =>
            setNewCustomerData((prevData) => ({
              ...prevData,
              firstName: e.target.value,
            }))
          }
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="input input-bordered w-full mb-6"
          onChange={(e) =>
            setNewCustomerData((prevData) => ({
              ...prevData,
              lastName: e.target.value,
            }))
          }
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full mb-6"
          onChange={(e) =>
            setNewCustomerData((prevData) => ({
              ...prevData,
              email: e.target.value,
            }))
          }
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="input input-bordered w-full mb-6"
          onChange={(e) =>
            setNewCustomerData((prevData) => ({
              ...prevData,
              phone: e.target.value,
            }))
          }
          required
        />
      </div>
      <button
        className="btn bg-indigo-950 text-white mt-5"
        type="submit"
        onClick={handleSignOut}
      >
        Submit
      </button>
    </form>
  );
}
