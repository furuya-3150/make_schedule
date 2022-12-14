import "./styles.css";

var weeks = ["日", "月", "火", "水", "木", "金", "土"];

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

  const week = weeks[date.getDay()];
  //フォマットの値を取得
  const selectFormatIndex =
    document.getElementById("select-format").selectedIndex;
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

  var textarea = document.getElementById("schedule-content").value;

  if (textarea === "") {
    document.getElementById("schedule-content").value = text;
  } else {
    document.getElementById("schedule-content").value += text;
  }
};

// textarea内を削除する
const onClickCopy = () => {
  const copyTarget = document.getElementById("schedule-content");
  copyTarget.select();
  document.execCommand("copy");
};

//　スケジュールの整理をする
const onClickArrangement = () => {
  const arrangementTarget = document.getElementById("schedule-content");
  if (arrangementTarget.value === "") return;

  // 選択されたフォーマットを取得
  const selectFormatIndex =
    document.getElementById("select-format").selectedIndex;

  //　改行ごとに配列に挿入
  var arrangement = arrangementTarget.value.split(/\n/);

  // 配列内の空白は削除
  arrangement = arrangement.filter(function (val) {
    return val !== "";
  });

  var year = "";
  var month = "";
  var day = "";
  var startTime = "";
  var endTime = "";

  const nowDate = new Date();
  var thisYear = nowDate.getFullYear();
  var thisMonth = nowDate.getMonth() + 1;

  var arrangemented = [];

  // 配列に入った日程を昇順にするために配列の要素をDate型に変更する
  arrangement.forEach(function (element) {
    startTime = element.substring(
      element.indexOf(")") + 2,
      element.indexOf("〜")
    );
    endTime = element.substring(element.indexOf("〜") + 1, element.length);
    if (selectFormatIndex === 0) {
      month = element.substring(0, element.indexOf("月"));
      if (thisMonth === 12 && month === "1") {
        year = thisYear + 1;
      } else {
        year = thisYear;
      }
      day = element.substring(element.indexOf("月") + 1, element.indexOf("日"));
    } else if (selectFormatIndex === 1) {
      year = element.substring(0, element.indexOf("年"));
      month = element.substring(
        element.indexOf("年") + 1,
        element.indexOf("月")
      );
      day = element.substring(element.indexOf("月") + 1, element.indexOf("日"));
    } else if (selectFormatIndex === 2) {
      month = element.substring(0, element.indexOf("/"));
      if (thisMonth === 12 && month === "1") {
        year = thisYear + 1;
      } else {
        year = thisYear;
      }
      day = element.substring(
        element.indexOf("/") + 1,
        element.indexOf("(") - 1
      );
    } else if (selectFormatIndex === 3) {
      year = element.substring(0, element.indexOf("/"));
      month = element.substring(
        element.indexOf("/") + 1,
        element.lastIndexOf("/")
      );
      day = element.substring(
        element.lastIndexOf("/") + 1,
        element.indexOf("(") - 1
      );
    }
    arrangemented.push([
      new Date(year + "/" + month + "/" + day + " " + startTime + ":00"),
      endTime,
    ]);
  });

  // Data型の配列をソートする
  arrangemented.sort(function (a, b) {
    return a[0] - b[0];
  });

  var year = "";
  var month = "";
  var day = "";
  var dayOfWeek = "";
  var text = "";
  var hour = "";
  var min = "";

  // Date型にした配列の要素を選択されたテンプレートに従い、出力
  arrangemented.forEach(function (element, index) {
    year = element[0].getFullYear();
    month = element[0].getMonth() + 1;
    day = element[0].getDate();
    dayOfWeek = weeks[element[0].getDay()];
    hour = element[0].getHours();
    min = element[0].getMinutes();
    
    // minが0だと15:0のように出力されるので文字列の00を代入
    if (min === 0) {
      min = "00";
    }

    if (selectFormatIndex === 0) {
      text =
        month +
        "月" +
        day +
        "日" +
        " (" +
        dayOfWeek +
        ") " +
        hour +
        ":" +
        min +
        "〜" +
        element[1];
      if (index === 0) {
        arrangementTarget.value = text + "\n";
      } else {
        arrangementTarget.value += text + "\n";
      }
    } else if (selectFormatIndex === 1) {
      text =
        year +
        "年" +
        month +
        "月" +
        day +
        "日" +
        " (" +
        dayOfWeek +
        ") " +
        hour +
        ":" +
        min +
        "〜" +
        element[1];

      if (index === 0) {
        arrangementTarget.value = text + "\n";
      } else {
        arrangementTarget.value += text + "\n";
      }
    } else if (selectFormatIndex === 2) {
      text =
        month +
        "/" +
        day +
        " (" +
        dayOfWeek +
        ") " +
        hour +
        ":" +
        min +
        "〜" +
        element[1];

      if (index === 0) {
        arrangementTarget.value = text + "\n";
      } else {
        arrangementTarget.value += text + "\n";
      }
    } else if (selectFormatIndex === 3) {
      text =
        year +
        "/" +
        month +
        "/" +
        day +
        " (" +
        dayOfWeek +
        ") " +
        hour +
        ":" +
        min +
        "〜" +
        element[1];
      if (index === 0) {
        arrangementTarget.value = text + "\n";
      } else {
        arrangementTarget.value += text + "\n";
      }
    }
  });
};

//　フォーマットを選択した時の処理
const onChangeSelectFormat = () => {
  const changeFormat = document.getElementById("schedule-content");
  if (changeFormat.value === "") return;

  //　textareaに入力されているものを配列に入れる
  var changeFormatTarget = changeFormat.value.split(/\n/);

  //配列に空白が含まれていれば、配列から削除する
  changeFormatTarget = changeFormatTarget.filter(function (val) {
    return val !== "";
  });

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

  // 配列の要素がどのフォーマットなのかわからないので、場合わけをして、指定の順序で日時などを新しい配列に挿入する
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
    } else if (!element.includes("/")) {
      month = element.substring(0, element.indexOf("月"));

      //　今月が12月で日程として1月が入力された場合来年の1月として扱う
      if (thisMonth === 12 && month === "1") {
        year = thisYear + 1;
      } else {
        year = thisYear;
      }
      day = element.substring(element.indexOf("月") + 1, element.indexOf("日"));
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
    }
    newFormat.push([year, month, day, dayOfWeek, startTime, endTime]);
  });

  // どのフォーマットを選んだのかを
  const selectFormatIndex =
    document.getElementById("select-format").selectedIndex;

  changeFormat.value = "";
  var weekAndTime = "";
  var text = "";

  // 新しい配列の要素を選択されたフォーマット別に出力していく
  newFormat.forEach(function (element) {
    weekAndTime = " (" + element[3] + ") " + element[4] + "〜" + element[5];

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
