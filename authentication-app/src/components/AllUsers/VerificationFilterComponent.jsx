import React from 'react'

const VerificationFilterComponent = ({verificationFilter, setVerificationFilter}) => {
  return (
    <div className="flex items-center mb-6">
          <label htmlFor="verificationFilter" className="mr-2 font-semibold text-sm text-gray-800">
            Filter by Verification:
          </label>
          <select
            id="verificationFilter"
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-md p-2"
          >
            <option value="all">All Users</option>
            <option value="verified">Verified Users</option>
            <option value="unverified">Unverified Users</option>
          </select>
        </div>
  )
}

export default VerificationFilterComponent