export default function ReturningCustomerSignout({customerList}) {
  return (
    <div className="col-start-4 col-span-5">
    <h1>Returning customer</h1>
      <selection>
        <select className="input input-bordered w-full my-6">
          <option>Select Customer</option>
          {customerList? customerList.map((customer) => (
            <option key={customer.id}>{customer.firstName} {customer.lastName}</option>
          ))
          : <option>No customers found</option>}
        </select>
      </selection>
    </div>
  );
}
