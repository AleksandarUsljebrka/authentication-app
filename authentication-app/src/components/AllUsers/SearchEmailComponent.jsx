
const SearchEmailComponent = ({children, handleEmailChange,email}) => {
  return (
    <div className="flex gap-4 ">
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => handleEmailChange(e)}
            className="px-4 py-2 border rounded-lg text-sm"
            placeholder="Search by Email"
          />
         {children}
        </div>
  )
}

export default SearchEmailComponent