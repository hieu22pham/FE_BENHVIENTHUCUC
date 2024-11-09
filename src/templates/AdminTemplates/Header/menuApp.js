import { UserOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHospital,
    faStethoscope,
    faIdCard,
} from "@fortawesome/free-solid-svg-icons";

export const adminMenu = [
    {
        //quản lý người dùng
        id: "1",
        name: "menu.admin.manage-user",
        icon: <UserOutlined style={{ fontSize: "20px" }} />,
        menus: [
            // {
            //     name: "menu.admin.crud",
            //     link: "/system/user-manage",
            // },
            {
                id: "sub_1_1",
                name: "menu.admin.crud-redux",
                //link: "/system/user-manage-redux",
                link: "/system/user-manage",
            },
            {
                id: "sub_1_2",
                name: "menu.admin.manage-doctor",
                link: "/system/manage-doctor",
                // subMenus: [
                //     {
                // name: "menu.system.system-administrator.user-manage",
                // link: "/system/user-manage",
                //     },
                // {
                //     name: "menu.system.system-administrator.user-manage-redux",
                //     link: "/system/user-manage-redux",
                // },
                // ],
            },
            {
                id: "sub_1_3",
                name: "menu.doctor.manage-schedule",
                link: "/system/manage-schedule",
            },
            // { name: 'menu.system.system-parameter.header', link: '/system/system-parameter' },
        ],
    },
    {
        //quản lý phòng khám
        id: "2",
        name: "menu.admin.clinic",
        icon: (
            <FontAwesomeIcon
                icon={faStethoscope}
                style={{ fontSize: "20px" }}
            />
        ),
        menus: [
            {
                id: "sub_2_1",
                name: "menu.admin.manage-clinic",
                link: "/system/manage-clinic",
            },
        ],
    },
    {
        //quản lý chuyên khoa
        id: "3",
        name: "menu.admin.specialty",
        icon: (
            <FontAwesomeIcon icon={faHospital} style={{ fontSize: "20px" }} />
        ),
        menus: [
            {
                id: "sub_3_1",
                name: "menu.admin.manage-specialty",
                link: "/system/manage-specialty",
            },
        ],
    },
    {
        //quản lý thông tin cá nhân
        id: "4",
        name: "menu.admin.profile",
        icon: <FontAwesomeIcon icon={faIdCard} style={{ fontSize: "20px" }} />,
        menus: [
            {
                id: "sub_4_1",
                name: "menu.admin.manage-profile",
                link: "/system/manage-profile",
            },
        ],
    },
    // {
    //     //quản lý phòng khám
    //     name: "menu.admin.handbook",
    //     menus: [
    //         {
    //             name: "menu.admin.manage-handbook",
    //             link: "/system/manage-handbook",
    //         },
    //     ],
    // },
];

export const doctorMenu = [
    {
        //quản lý người dùng
        name: "menu.admin.manage-user",
        icon: <UserOutlined style={{ fontSize: "20px" }} />,
        menus: [
            {
                name: "menu.doctor.manage-schedule",
                link: "/doctor/manage-schedule",
            },
            //Quản lý bệnh nhân
            {
                name: "menu.doctor.manage-patient",
                link: "/doctor/manage-patient",
            },
        ],
    },
    {
        //quản lý thông tin cá nhân
        id: "4",
        name: "menu.admin.profile",
        icon: <FontAwesomeIcon icon={faIdCard} style={{ fontSize: "20px" }} />,
        menus: [
            {
                id: "sub_4_1",
                name: "menu.admin.manage-profile",
                link: "/system/manage-profile",
            },
        ],
    },
];
