import styles from "./video-modal.module.css";
import icons from "@/constants/icons";

type VideoModalProps = {
  toggleModal: () => void;
};

const VideoModal = ({ toggleModal }: VideoModalProps) => {
  return (
    <div className={styles.modal_overlay} onClick={toggleModal}>
      <button
        className={styles.close_button}
        onClick={toggleModal}
        aria-label="Close Video"
      >
        {icons.Close}
      </button>

      <div
        className={styles.modal_content}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className={styles.youtube_embed_wrapper}>
          <iframe
            className={styles.youtube_embed}
            width="560"
            height="315"
            src="https://www.youtube.com/embed/occycDAXmAA?si=suhhlH0G2Uny3KSc"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
