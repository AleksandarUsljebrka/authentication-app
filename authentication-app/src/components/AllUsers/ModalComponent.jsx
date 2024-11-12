import Modal from "react-modal";

const ModalComponent = ({isModalOpen, setIsModalOpen, confirmDelete}) => {
  return (
    <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Confirm Delete"
        className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-gray-800"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
          <h3 className="text-xl font-semibold mb-4">
            Are you sure you want to delete this user?
          </h3>
          <div className="flex justify-around">
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
            >
              Confirm
            </button>
          </div>
        </div>
      </Modal>
  )
}

export default ModalComponent