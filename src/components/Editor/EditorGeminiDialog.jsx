import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useMemo, useState } from "react";
import { Toast } from "../Common/Toast";
import classes from "./Editor.module.css";

export default function EditorGeminiDialog({ editor, open, onClose }) {
  const [isGeminiRunning, setIsGeminiRunning] = useState(false);
  const model = useMemo(() => {
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API);
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = editor.getHTML();
    const userPrompt = e.target.elements.userPrompt.value;
    const defaultPrompt =
      " = 앞서 제공된 HTML 형식의 본문 내용을 뒤이어 입력될 사용자의 요청에 맞게 개선해주세요. 출력값은 반드시 아래 사항들을 준수해야 합니다. \
      1. 만약 사용자가 입력한 요청이 충분하지 않더라도 반드시 결과값은 제공된 본문을 바탕으로 개선된 내용을 담고 있을 것 \
      2. 결과값은 #, *를 비롯한 각종 마크다운 기호를 완전 배제한 채, 순수히 HTML 태그과 한국어만으로 이루어진 HTML 문법을 준수하는 코드의 형태를 갖춰야 함. \
      3. ```html 같은 코드블럭은 사용하지 말 것. \
      이 다음은 사용자의 요청임. = ";

    // Generate Content if editor is not empty
    if (!editor.isEmpty) {
      setIsGeminiRunning(true);
      model
        .generateContent(content + defaultPrompt + userPrompt)
        .then((result) => {
          editor.commands.setContent(result.response.text());
          setIsGeminiRunning(false);
          onClose();
        });
    } else {
      Toast.error("본문이 비어있는 상태에서는 사용할 수 없습니다.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit,
      }}
      className={isGeminiRunning ? classes.geminiDialogLoading : classes.geminiDialog}
    >
      <DialogTitle>Gemini AI</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Gemini AI로 본문을 어떻게 개선하고 싶으신가요?
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="dense"
          id="userPrompt"
          label="본문을 어떻게 개선하고 싶으신가요?"
          type="text"
          fullWidth
          multiline
          disabled={isGeminiRunning}
          sx={{ marginTop: "1.3rem" }}
        />
      </DialogContent>
      <DialogActions sx={{ padding: "0 1rem 1rem 1rem" }}>
        <Button onClick={onClose} disabled={isGeminiRunning}>취소</Button>
        <Button type="submit" variant="contained" disabled={isGeminiRunning}>
          {isGeminiRunning ? "처리 중..." : "확인"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
