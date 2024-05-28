const SliderDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <>
      <dialog
        id="sliderDialog"
        className={`${isOpen ? "open" : ""}`}
        open={isOpen}
      >
        <h2>Slider Window Content</h2>
        <p>This is the content of your slider window.</p>
        <button onClick={onClose}>Close</button>
      </dialog>
      {isOpen && <div id="overlay" onClick={onClose}></div>}
    </>
  );
};

export default SliderDialog;
