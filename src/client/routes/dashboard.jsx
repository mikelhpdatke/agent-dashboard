// @material-ui/icons
import Dashboard from '@material-ui/icons/Dashboard';
import Person from '@material-ui/icons/Person';
// import ContentPaste from "@material-ui/icons/ContentPaste";
import Assignment from '@material-ui/icons/Assignment';
import BubbleChart from '@material-ui/icons/BubbleChart';
import LocationOn from '@material-ui/icons/LocationOn';
import Notifications from '@material-ui/icons/Notifications';
import ImportantDevices from '@material-ui/icons/ImportantDevices';
// core components/views
import DashboardPage from 'views/Dashboard/Dashboard.jsx';
import UserProfile from 'views/UserProfile/UserProfile.jsx';
import TableList from 'views/TableList/TableList.jsx';
import Typography from 'views/Typography/Typography.jsx';
import Icons from 'views/Icons/Icons.jsx';
import Services from 'components/Home/Services.js';
import Manager from 'views/Manager/Manager.jsx';
import { services } from '../_reducers/services.reducer';

const dashboardRoutes = [
  {
    path: '/dashboard',
    sidebarName: 'Dashboard',
    navbarName: 'Material Dashboard',
    icon: Dashboard,
    component: DashboardPage,
  },
  {
    path: '/manager',
    sidebarName: 'Quản lý thiết bị',
    navbarName: 'Giao diện quản lý tác tử trên các thiết bị',
    icon: ImportantDevices,
    component: Manager,
  },
  {
    path: '/log',
    sidebarName: 'Quản lý Log',
    navbarName: 'Giao diện quản lý thiết bị',
    icon: Assignment,
    component: Manager,
  },
  {
    path: '/service',
    sidebarName: 'Quản lý dịch vụ',
    navbarName: 'Giao diện quản lý tác tử trên các thiết bị',
    icon: BubbleChart,
    component: Manager,
  },
  {
    path: '/alert',
    sidebarName: 'Phát hiện tấn công',
    navbarName: 'Giao diện quản lý thiết bị',
    icon: Notifications,
    component: Manager,
  },
  {
    path: '/services',
    component: Services,
    navbarName: 'Phân tích dữ liệu của thiết bị',
  },
  { redirect: true, path: '/', to: '/dashboard', navbarName: 'Redirect' },
];

export default dashboardRoutes;
