import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { Toast } from "../Common/Toast";
import apiInstance from "../../provider/networkProvider";
import { useNavigate } from "react-router-dom";

export default function DeleteDialog({ isOpen, onClose, onCancel, deleteAPIURL }) {
  const navigate = useNavigate();
  const onProceed = () => {
    DeleteRequest(deleteAPIURL).then((res) => {
      if(res == 200) {
        Toast.success("게시글을 삭제했습니다.")
        navigate(-1);
      } else {
        Toast.error("게시글을 삭제하는데 실패했습니다.")
      }
    })
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-del-rec-title"
      aria-describedby="alert-del-rec-desc"
      closeAfterTransition={false}
    >
      <DialogTitle id="alert-del-rec-title">
        정말로 삭제하시겠습니까?
      </DialogTitle>
      <DialogContent id="alert-del-rec-desc">
        <DialogContentText>
          삭제된 게시글은 다시 복원할 수 없습니다.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>취소</Button>
        <Button onClick={onProceed}>확인</Button>
      </DialogActions>
    </Dialog>
  );
}

// 삭제 요청 함수
async function DeleteRequest(url) {
  try {
    const response = await apiInstance.delete(url);
    // 추가 성공
    return response.status;
  } catch (error) {
    // 추가 실패
  }
  return 0;
}