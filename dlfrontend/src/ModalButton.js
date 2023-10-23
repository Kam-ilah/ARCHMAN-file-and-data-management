import React, { useState, useEffect } from "react";

import { Button, Modal } from "antd";
const ModalButton = () => {
  const [modal2Open, setModal2Open] = useState(false);

  return (
    <>
      {/* <Button type="primary" onClick={() => setModal2Open(true)}>
        Rename
      </Button> */}
      <Modal
        title="Please enter the new name"
        centered
        open={modal2Open}
        onOk={() => setModal2Open(false)}
        onCancel={() => setModal2Open(false)}
      >
        <form>
          <label>
            <input type="text" />
          </label>
        </form>
      </Modal>
    </>
  );
};
export default ModalButton;
