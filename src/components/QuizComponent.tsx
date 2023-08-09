import { FC, useState } from 'react';
import "../styles/QuizComponentStyle.css";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import * as interfaceConstants from '../utils/interface-constants';
import * as navigatorConstants from '../utils/navigator-constants';
import { useNavigate } from 'react-router-dom';
import { Quiz } from '../models/Quiz';
import * as apiConstants from '../utils/api-constants';
import toast from 'react-hot-toast';

export const QuizComponent: FC<{
  quiz: Quiz,
  setSelectedQuiz: Function,
  setDeleteModalOpen: Function
}> = ({ quiz, setSelectedQuiz, setDeleteModalOpen }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleExpand = async () => {
    setExpanded(!expanded);
  };

  const handlePlayBtnClicked = () =>{
    fetch(`${apiConstants.baseUrl}${apiConstants.createRoom}/${quiz.id}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then((response) => {
        if(response.status != 200){
          toast.error(response.statusText, {
              position: "top-right",
              duration: 3000
            });
            return;
        }
        return response.json();
      })
      .then((response) =>{
        navigate(navigatorConstants.HostPage + "/" + response.id);
      })
      .catch((error) => {
        toast.error(error, {
          position: "top-right",
          duration: 3000
        });
      });
  }

  return (
    <div
      className={`quiz-component ${expanded ? 'expanded' : ''}`}
      onMouseEnter={handleExpand}
      onMouseLeave={handleExpand}
    >
      <div className='title-description-wrapper'>
        <div className="title">{interfaceConstants.title}{quiz.title}</div>
        {quiz.description != null && <div className="description">{interfaceConstants.description}{quiz.description}</div>}
      </div>
      {expanded && (
        <div className="expanded-content">
          <div className="buttons">
            <Tooltip title={interfaceConstants.playQuiz}>
              <IconButton onClick={handlePlayBtnClicked} disabled={quiz.readOnly}>
                <PlayCircleFilledIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={interfaceConstants.editQuiz}>
              <IconButton disabled={quiz.readOnly} onClick={() => navigate(navigatorConstants.FormQuizPage + "/" + quiz.id)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={interfaceConstants.deleteQuiz}>
              <IconButton disabled={quiz.readOnly} onClick={() => {
                setDeleteModalOpen(true);
                setSelectedQuiz(quiz);
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