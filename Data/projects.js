//Embedded 1 (In)
//KindQuest (In)
//Distributed (In)
//N-Queens (A Cool one)
//Linux Shell (Not Sure)
//Hediaty
//Grad Project



export const projectsData = [
    {
        name : "Hazard Detection",
        imagePath : "Hazard.png",
        github: "https://github.com/DevYehia/Hazard-Detection-System",
        tech: "Embedded C",
        dialogue : [
            "This was my embedded systems course project, We built a Hazard detection system using Tiva-C, ultrasonic sensor and smoke sensor",
            "The hazard info would be sent to the phone via bluetooth, Also would be sent to another micro-controller (Atmega32) via Light Signals",
            "The Atmega32 activates a buzzer and displays the hazard on an LCD",
            "It was a really cool project and i loved working on it with great people"
        ]
    },
    {
        name: "Kind Quest",
        imagePath : "KindQuest.jpg",
        tech: "PHP/MySQL",
        github: "https://github.com/Moisis/KindQuest",
        dialogue : [
            "This is a charity website, we built for the Design Patterns Course",
            "You can go into the website to create or join various charity events or just donate money to charities",
            "We tried to apply many design patterns here like: Decorator, Proxy, Observer, etc..",
            "It was a fun project, What's this image you ask?",
            "Well it was when me and the bois were working on the MVC Pattern on discord, Ah Fun times"
        ]
    },
    {
        name: "Distributed Image\nProcessing",
        imagePath : "Distributed.png",
        tech: "Python/AWS",
        github: "https://github.com/DevYehia/DIstributed_Image_Processing",
        video: "https://youtu.be/yUOk4aUAsx0?si=M3Gxyc-txp2hzi5g",
        dialogue : [
            "This is an image processing application (using python) that modified selected images with various filters like: grayscale, rotation, etc..",
            "This project was deployed on AWS EC2, It was my first ever interaction with AWS",
            "We also built a custom load balancer that would distribute the load on 3 servers",
            "This was one of the best projects i had worked on and it really benefitted me"
        ]
    },
    {
        name: "N-Queens\nVisualizer",
        imagePath : "NQueens.svg",
        tech: "C++/Qt",
        github: "https://github.com/DevYehia/NQueensVisualizer",
        dialogue : [
            "This was a side project where my goal was to visualize the N-Queens Problem",
            "The Problem was to try to place N Queens on NxN board without anyone being able to attack each other",
            "I built this visualization application using C++ QT to visualize how the solution algorithm works to find a solution",
        ]
    },
    {
        name: "Custom Linux\nShell",
        imagePath : "Shell.png",
        tech: "C/Linux",
        github: "https://github.com/DevYehia/Custom_Linux_Shell",
        dialogue : [
            "This was a side project i built with my friend",
            "I was interested in how system calls worked on linux so me and my friend tried to build something that uses these system calls in linux i.e.: our shell",
            "This shell is able to execute some commands like pwd, ls and cat (we named it meow). It can also execute applications from it"
        ]
    },
    {
        name: "Hediaty",
        imagePath : "Gift.jpg",
        tech: "Flutter/Firebase",
        github: "https://github.com/DevYehia/Hediaty-Gifter",
        dialogue : [
            "This was my first (and only) Mobile Application using flutter",
            "It is a gifting app where you can see your friend's events and what gifts they want",
            "then you can pledge the gifts you want to buy them",
            "This app was built with SQLite for local storage and firebase for cloud storage"
        ]
    },
    {
        name: "This",
        imagePath : "this.png",
        tech: "JavaScript/Three.js",
        github: "https://github.com/DevYehia/Hediaty-Gifter",
        dialogue : [
            "And the most important project of them all is ...",
            "This one, the one you are currently in",
            "It was a really fun project and made me understand more on how three js works and also made me think of fun ways to express myself"
        ]
    },
]