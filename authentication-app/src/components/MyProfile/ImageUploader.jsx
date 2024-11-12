import addPhoto from "../../assets/addPhoto.png";

const ImageUploader = ({handleImageChange, handleImageClick, profileImage,inputRef, label}) => {
  return ( 
  <div className="flex justify-between">
    <div>
      <label className="block text-sm font-medium text-gray-700" htmlFor="profileImage">
        {label}
      </label>
      <div
        className="mt-2 flex flex-col justify-self-start cursor-pointer"
        onClick={handleImageClick}
      >
        {profileImage ? (
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="w-36 h-40 mb-11 rounded-lg border-black shadow-xl object-contain"
            />
            <img src={addPhoto} alt="Add" className="w-6 h-6 absolute bottom-6 -right-2" />
          </div>
        ) : (
          <div className="w-36 h-40 mb-11 ml-3 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <input
          id="profileImage"
          name="profileImage"
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={handleImageChange}
          className="w-2/3 hidden"
        />
      </div>
    </div>
  </div>
  )
}

export default ImageUploader