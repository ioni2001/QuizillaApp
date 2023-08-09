import { FC, useState } from 'react';
import "../styles/QuestionComponentStyle.css";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as interfaceConstants from '../utils/interface-constants';
import { useNavigate } from 'react-router-dom';
import { Question } from '../models/Question';

export const QuestionComponent: FC<{
  question: Question,
  setModalDeleteOpen: Function,
  setClickedQuestion: Function,
  setModalEditOpen: Function
}> = ({ question, setModalDeleteOpen, setClickedQuestion, setModalEditOpen }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleExpand = async () => {
    setExpanded(!expanded);
  };

  return (
    <div
      className={`question-component ${expanded ? 'expanded' : ''}`}
      onMouseEnter={handleExpand}
      onMouseLeave={handleExpand}
    >
      <div className='text-timer-wrapper'>
        <div className="text">{interfaceConstants.text}{question.text}</div>
        <div className="timer">{interfaceConstants.timer}{question.time}</div>
      </div>
      {expanded && (
        <div className="expanded-content">
          <div className="buttons">
            <Tooltip title={interfaceConstants.editQuestion}>
              <IconButton onClick={() => {
                  setClickedQuestion(question);
                  setModalEditOpen(true);
              }}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={interfaceConstants.deleteQuestion}>
              <IconButton onClick={() => {
                setModalDeleteOpen(true);
                setClickedQuestion(question);
              }
              }>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};