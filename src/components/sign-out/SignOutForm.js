export default function SignOutForm({ handleSubmit, handleInputChange }) {
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
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="input input-bordered w-full mb-6"
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="input input-bordered w-full mb-6"
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          placeholder="Phone Number"
          className="input input-bordered w-full mb-6"
          onChange={handleInputChange}
          required
        />
      </div>
    </form>
  );
}
