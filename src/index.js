import "./styles.css";

const onClickAdd = () => {
  //　日時フィールドの値を取得
  var inputDate = document.getElementById("vacant-date").value;
  const inputStartTime = document.getElementById("start-time").value;
  const inputEndTime = document.getElementById("end-time").value;

  //　バリデーション
  if (inputDate === "" || inputStartTime === "" || inputEndTime === "") {
    alert("全て入力してください");
    return;
  }

  if (inputStartTime >= inputEndTime) {
    alert("正しい時刻を入力してください");
    return;
  }

  //　フィールドを空にする
  document.getElementById("vacant-date").value = "";
  document.getElementById("start-time").value = "";
  document.getElementById("end-time").value = "";

  // 入力された日程をDate型に変更
  const date = new Date(inputDate);

  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();

  const putDate = date.toLocaleDateString();

  // 日にちから曜日を炙る
  var weeks = ["日", "月", "火", "水", "木", "金", "土"];
  const week = weeks[date.getDay()];
  //フォマットの値を取得
  const selectFormatIndex = document.getElementById("select-format")
    .selectedIndex;
  var text = "";
  const weekTimeTemp =
    " (" + week + ") " + inputStartTime + "〜" + inputEndTime + "\n";

  if (selectFormatIndex === 0) {
    text = month + "月" + day + "日" + weekTimeTemp;
  }

  if (selectFormatIndex === 1) {
    text = year + "年" + month + "月" + day + "日" + weekTimeTemp;
  }

  if (selectFormatIndex === 2) {
    text = month + "/" + day + weekTimeTemp;
  }

  if (selectFormatIndex === 3) {
    text = putDate + weekTimeTemp;
  }

  // divタグの子要素に各種
  //document.getElementById("schedule-content").value += "\n" + text;

  var textarea = document.getElementById("schedule-content").value;
  //console.log(textarea);

  if (textarea === "") {
    document.getElementById("schedule-content").value = text;
  } else {
    document.getElementById("schedule-content").value += text;
  }
};

const onClickCopy = () => {
  const copyTarget = document.getElementById("schedule-content");
  copyTarget.select();
  document.execCommand("copy");
};

//　スケジュールの整理をする
const onClickArrangement = () => {
  const arrangementTarget = document.getElementById("schedule-content");
  if (arrangementTarget.value === "") return;

  // フォーマットが整っていない可能性があるので整える
  //onClickArrangement();

  // 選択されたフォーマットを取得
  const selectFormatIndex = document.getElementById("select-format")
    .selectedIndex;

  //　改行ごとに配列に挿入
  var arrangement = arrangementTarget.value.split(/\n/);
  arrangement = arrangement.filter(function (val) {
    return val !== "";
  });

  // console.log(arrangement);
  // return;

  var year = "";
  var month = "";
  var day = "";
  var startTime = "";

  const nowDate = new Date();
  var thisYear = nowDate.getFullYear();
  var thisMonth = nowDate.getMonth() + 1;

  var arrangemented = [];

  arrangement.forEach(function (element) {
    startTime = element.substring(
      element.indexOf(")") + 2,
      element.indexOf("〜")
    );
    if (selectFormatIndex === 0) {
      month = element.substring(0, element.indexOf("月"));
      if (thisMonth === 12 && month === "1") {
        year = thisYear + 1;
      } else {
        year = thisYear;
      }
      day = element.substring(element.indexOf("月") + 1, element.indexOf("日"));
      arrangemented.push(
        new Date(year + "/" + month + "/" + day + " " + startTime + ":00")
      );
    } else if (selectFormatIndex === 1) {
      year = element.substring(0, element.indexOf("年"));
      month = element.substring(
        element.indexOf("年") + 1,
        element.indexOf("月")
      );
      day = element.substring(element.indexOf("月") + 1, element.indexOf("日"));
      arrangemented.push(new Date());
    } else if (selectFormatIndex === 2) {
    } else if (selectFormatIndex === 1) {
    }
  });
  // Date型に合うように変形し、比較をする
  arrangement.sort(function (a, b) {
    const dateA = new Date(
      a.substr(0, a.indexOf("(")) + a.substr(a.indexOf(")") + 2, 5) + ":00"
    );
    const dateB = new Date(
      b.substr(0, b.indexOf("(")) + b.substr(b.indexOf(")") + 2, 5) + ":00"
    );

    return dateA - dateB;
  });

  var count = 0;
  arrangement.forEach(function (element) {
    if (count === 0) {
      document.getElementById("schedule-content").value = element + "\n";
    } else {
      document.getElementById("schedule-content").value += element + "\n";
    }
    count += 1;
  });
  //console.log(arrangement);
};

//　フォーマットを選択した時の処理
const onChangeSelectFormat = () => {
  const changeFormat = document.getElementById("schedule-content");
  if (changeFormat.value === "") return;

  var changeFormatTarget = changeFormat.value.split(/\n/);

  //配列に空白が含まれていれば、配列から削除する
  changeFormatTarget = changeFormatTarget.filter(function (val) {
    return val !== "";
  });

  console.log(changeFormatTarget);

  var year = "";
  var month = "";
  var day = "";
  var dayOfWeek = "";
  var startTime = "";
  var endTime = "";

  const nowDate = new Date();
  var thisYear = nowDate.getFullYear();
  var thisMonth = nowDate.getMonth() + 1;

  var newFormat = [];
  changeFormatTarget.forEach(function (element) {
    dayOfWeek = element.substring(
      element.indexOf("(") + 1,
      element.indexOf(")")
    );
    startTime = element.substring(
      element.indexOf(")") + 2,
      element.indexOf("〜")
    );
    endTime = element.substring(element.indexOf("〜") + 1, element.length);
    if (element.match(/年/)) {
      year = element.substring(0, element.indexOf("年"));
      month = element.substring(
        element.indexOf("年") + 1,
        element.indexOf("月")
      );
      day = element.substring(element.indexOf("月") + 1, element.indexOf("日"));
      console.log("aaaaaaaa");
    } else if (!element.includes("/")) {
      month = element.substring(0, element.indexOf("月"));
      if (thisMonth === 12 && month === "1") {
        year = thisYear + 1;
      } else {
        year = thisYear;
      }
      day = element.substring(element.indexOf("月") + 1, element.indexOf("日"));
      console.log("bbbbbbbbbb");
    } else if (element.substring(0, element.indexOf("/")).length > 3) {
      year = element.substring(0, element.indexOf("/"));
      month = element.substring(
        element.indexOf("/") + 1,
        element.lastIndexOf("/")
      );
      day = element.substring(
        element.lastIndexOf("/") + 1,
        element.indexOf("(") - 1
      );
      console.log("cccccccccc");
    } else if (element.substring(0, element.indexOf("/")).length < 3) {
      month = element.substring(0, element.indexOf("/"));

      //　今月が12月で日程として1月が入力された場合来年の1月として扱う
      if (thisMonth === 12 && month === "1") {
        year = thisYear + 1;
      } else {
        year = thisYear;
      }
      day = element.substring(
        element.indexOf("/") + 1,
        element.indexOf("(") - 1
      );
      console.log("dddddddddd");
    }
    newFormat.push([year, month, day, dayOfWeek, startTime, endTime]);
  });

  console.log(newFormat);

  // どのフォーマットを選んだのかを
  const selectFormatIndex = document.getElementById("select-format")
    .selectedIndex;

  changeFormat.value = "";
  var weekAndTime = "";
  var text = "";
  newFormat.forEach(function (element) {
    weekAndTime = " (" + element[3] + ") " + element[4] + "〜" + element[5];
    console.log(weekAndTime);

    if (selectFormatIndex === 0) {
      text = element[1] + "月" + element[2] + "日" + weekAndTime;
    } else if (selectFormatIndex === 1) {
      text =
        element[0] + "年" + element[1] + "月" + element[2] + "日" + weekAndTime;
    } else if (selectFormatIndex === 2) {
      text = element[1] + "/" + element[2] + weekAndTime;
    } else if (selectFormatIndex === 3) {
      text = element[0] + "/" + element[1] + "/" + element[2] + weekAndTime;
    }

    if (changeFormat.value === "") {
      changeFormat.value = text + "\n";
    } else {
      changeFormat.value += text + "\n";
    }
  });
};

document
  .getElementById("add-datetime")
  .addEventListener("click", () => onClickAdd());

document
  .getElementById("copy-button")
  .addEventListener("click", () => onClickCopy());

if (document.getElementById("arrangement-button")) {
  document
    .getElementById("arrangement-button")
    .addEventListener("click", () => onClickArrangement());
}

document
  .getElementById("select-format")
  .addEventListener("change", () => onChangeSelectFormat());
