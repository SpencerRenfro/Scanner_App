import React from 'react'

function ItemFoundCard(props) {
  return (
    <div className="mt-10 card bg-slate-600 dark:bg-purple-500 text-primary-content w-96">
    <div className="card-body">
      <div role="alert" className="alert alert-success ">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Item Found!</span>
      </div>
      <h2 className="card-title">{props.name}</h2>
      <p>{props.description}</p>
      <p>{props.category}</p>
      <div className=" items-start ">
        <p className="">Status: </p>

        {props.status === "IN" ? (
          <p className="text-center w-8 rounded-md bg-green-500 px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-green-600/20">
            IN
          </p>
        ) : (
          <p className="text-center w-8 rounded-md bg-red-500  py-1 text-xs font-medium text-white ring-1 ring-inset ring-red-600/20">
            OUT
          </p>
        )}
      </div>
      <div className="card-actions justify-end">
        <button className={`btn ${props.status === "OUT" ? 'hidden' : ''}`}>Sign out</button>
        <button className={`btn ${props.status === "IN" ? 'hidden' : ''}`}  onClick={props.handleSignIn}>Sign In</button>
      </div>
    </div>
  </div>
  )
}

export default ItemFoundCard