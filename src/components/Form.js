import React from 'react'

export default function Form() {
  return (
    <div>
        <form className="mx-40 border flex flex-col items-center">
            <label>
            <p>Item Name</p>
            <input
                type="text"
                onChange={(e) =>
                console.log('value' + e.target.value)
                }
            required
            />
            </label>
            <label>
            <span>
                <p>Item Category</p>
                <input
                type="text"
                onChange={(e) => {
                    console.log('$', + e.target.value)
                }}
                />
            </span>
            </label>
            <label>
                <p>Item Price</p>
                <input
                type="text"
                onChange={(e) => {
                    console.log('$', + e.target.value)
                }}
                />
            </label>
        </form>
    </div>
  )
}
