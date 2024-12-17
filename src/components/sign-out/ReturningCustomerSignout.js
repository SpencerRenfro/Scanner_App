export default function ReturningCustomerSignout({
  customerList,
  getReturningCustomerData,
}) {
  return (
    <div className="col-start-4 col-span-5">
      <h1>Returning customer</h1>
      <select
        className="input input-bordered w-full my-6"
        onChange={getReturningCustomerData}
      >
        <option>Select Customer</option>
        {customerList ? (
          customerList.map((customer) => (
            <option key={customer.id}>
              {customer.firstName} {customer.lastName}
            </option>
          ))
        ) : (
          <option>No customers found</option>
        )}
      </select>
    </div>
  );
}
