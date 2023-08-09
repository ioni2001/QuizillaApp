import { Modal } from "@fluentui/react";
import { Button } from "@mui/material";
import { FC } from "react";
import * as interfaceConstants from '../utils/interface-constants';
import "../styles/AreYouSureModalStyle.css";
import { Question } from "../models/Question";

export const AreYouSureModal: FC<{
    message: string,
    open: boolean,
    setOpen: Function,
    handleConfirm: Function
}> = ({ message, open, setOpen, handleConfirm }) => {
    return (
        <Modal
            isOpen={open}
            onDismiss={() => setOpen(!open)}
            containerClassName="root-areyousure-modal"
        >
            <div className="paragraph-areyousuremodal-wrapper">
                <p className="paragraph-areyousuremodal">
                    {message}
                </p>
            </div>
            <div className="buttons-areyousuremodal-wrapper">
                <Button color="success" variant="outlined" onClick={() => handleConfirm()}>{interfaceConstants.yes}</Button>
                <Button color="error" variant="outlined" onClick={() => setOpen(!open)}>{interfaceConstants.cancel}</Button>
            </div>
        </Modal>
    );
}