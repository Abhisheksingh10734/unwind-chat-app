const homeNav = [
    {id: 1, title: "Chats"},
    {id: 2, title: "Groups"},
    {id: 3, title: "Online"}
];

const users = [
    {
        id: 1,
        userLogo: "RK",
        userName: "Rahul Kumar",
        status: "online",
        lastSeen: "2m",
        pendingCount: 3
    },
    {
        id: 2,
        userLogo: "AS",
        userName: "Abhishek Singh",
        status: "online",
        lastSeen: "10m",
        pendingCount: 0
    },
    {
        id: 3,
        userLogo: "PJ",
        userName: "Pankaj Joshi",
        status: "offline",
        lastSeen: "2h",
        pendingCount: 30
    },
    {
        id: 4,
        userLogo: "AS",
        userName: "Anadi Singh",
        status: "away",
        lastSeen: "2d",
        pendingCount: 0
    },
    {
        id: 5,
        userLogo: "GD",
        userName: "Gaurav Dubey",
        status: "busy",
        lastSeen: "10d",
        pendingCount: 100
    },
    {
        id: 6,
        userLogo: "AY",
        userName: "Aryan Yadav",
        status: "offline",
        lastSeen: "15h",
        pendingCount: 0
    },
    {
        id: 7,
        userLogo: "DC",
        userName: "Deepak Chahar",
        status: "offline",
        lastSeen: "2m",
        pendingCount: 0
    },
    {
        id: 8,
        userLogo: "MS",
        userName: "Mahendra Singh Dhoni",
        status: "offline",
        lastSeen: "5m",
        pendingCount: 0
    }
];

const homeFooter = [
    {
        icon: "🗣️",
        title: "Chats"
    },
    {
        icon: "👨‍👩‍👧‍👦",
        title: "Groups"
    },
    {
        icon: "🚨",
        title: "Alerts"
    },
    {
        icon: "AS",
        title: "Me"
    },
];

export {
    homeNav,
    users,
    homeFooter
}