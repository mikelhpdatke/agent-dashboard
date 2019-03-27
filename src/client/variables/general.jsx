// ##############################
// // // Tasks for TasksCard - see Dashboard view
// #############################

let bugs = [
  'Router 1 không nhận dữ liệu"',
  'Tác tử 2 không hoạt động',
  'Lấy thôn tin tác tử bị lỗi',
  'Kết nối mạng không ổn định'
];
let website = ['Trang web chưa được tối ưu', 'Lỗi hiện thị dữ liệu'];
let server = [
  'Kết nối cơ sở dữ liệu bị lỗi',
  'Máy chủ vừa khởi động lại',
  'Lỗi 404',
];

module.exports = {
  // these 3 are used to create the tasks lists in TasksCard - Dashboard view
  bugs,
  website,
  server,
};
