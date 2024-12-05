export default function UserValidate(data, type) {
  const errors = {};

  if (!data.password) {
    errors.password = "비밀번호를 입력해주세요.";
  } else if (data.password.length < 5) {
    errors.password = "비밀번호는 5글자 이상이어야 합니다.";
  } else if (data.password.length > 20) {
    errors.password = "비밀번호는 20글자 이하이어야 합니다.";
  } else {
    delete errors.password;
  }

  if (type === "signup") {
    if (!data.email) {
      errors.email = "이메일을 입력해주세요.";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "사용할 수 없는 이메일 주소가 입력되었습니다.";
    } else {
      delete errors.email;
    }

    if (!data.confirmPassword) {
      errors.confirmPassword = "비밀번호를 다시 한 번 입력해주세요.";
    } else if (data.confirmPassword !== data.password) {
      errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    } else {
      delete errors.confirmPassword;
    }

    if (!data.loginId.trim()) {
      errors.loginId = "아이디를 입력해주세요.";
    } else if (data.loginId.length > 20) {
      errors.loginId = "아이디는 20글자 이하이어야 합니다.";
    } else {
      delete errors.loginId;
    }

    if (!data.nickName.trim()) {
      errors.nickName = "별명을 입력해주세요.";
    } else if (data.nickName.length < 5) {
      errors.nickName = "별명은 5글자 이상이어야 합니다.";
    } else if (data.nickName.length > 20) {
      errors.nickName = "별명은 20글자 이하이어야 합니다.";
    } else {
      delete errors.nickName;
    }

    if (!data.loginId.trim()) {
      errors.loginId = "아이디를 입력해주세요.";
    } else if (data.loginId.length > 20) {
      errors.loginId = "아이디는 20글자 이하이어야 합니다.";
    } else {
      delete errors.loginId;
    }

    if (!data.sex) {
      errors.sex = "성별을 선택해주세요.";
    } else {
      delete errors.sex;
    }

    if (!data.birthDay) {
      errors.birthDay = "생년월일을 입력해주세요.";
    } else {
      delete errors.birthDay;
    }
  }

  if (type === "signin") {
    if (!data.userID.trim()) {
      errors.userID = "아이디를 입력해주세요.";
    } else if (data.userID.length > 20) {
      errors.userID = "아이디는 20글자 이하이어야 합니다.";
    } else {
      delete errors.userID;
    }
  }

  if (type === "changePassword") {
    if (!data.newPassword) {
      errors.newPassword = "새로운 비밀번호를 입력해주세요.";
    } else if (data.newPassword.length < 5) {
      errors.newPassword = "비밀번호는 5글자 이상이어야 합니다.";
    } else if (data.newPassword.length > 20) {
      errors.newPassword = "비밀번호는 20글자 이하이어야 합니다.";
    } else {
      delete errors.newPassword;
    }
  }

  return errors;
}