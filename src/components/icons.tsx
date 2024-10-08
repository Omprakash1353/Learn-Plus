type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  google: (props: IconProps) => (
    <svg
      xmlSpace="preserve"
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      {...props}
      className="mr-2"
    >
      <path
        d="M113.47,309.408L95.648,375.94l-65.139,1.378C11.042,341.211,0,299.9,0,256
	c0-42.451,10.324-82.483,28.624-117.732h0.014l57.992,10.632l25.404,57.644c-5.317,15.501-8.215,32.141-8.215,49.456
	C103.821,274.792,107.225,292.797,113.47,309.408z"
        style={{ fill: "#FBBB00" }}
      ></path>
      <path
        d="M507.527,208.176C510.467,223.662,512,239.655,512,256c0,18.328-1.927,36.206-5.598,53.451
	c-12.462,58.683-45.025,109.925-90.134,146.187l-0.014-0.014l-73.044-3.727l-10.338-64.535
	c29.932-17.554,53.324-45.025,65.646-77.911h-136.89V208.176h138.887L507.527,208.176L507.527,208.176z"
        style={{ fill: "#518EF8" }}
      ></path>
      <path
        d="M416.253,455.624l0.014,0.014C372.396,490.901,316.666,512,256,512
	c-97.491,0-182.252-54.491-225.491-134.681l82.961-67.91c21.619,57.698,77.278,98.771,142.53,98.771
	c28.047,0,54.323-7.582,76.87-20.818L416.253,455.624z"
        style={{ fill: "#28B446" }}
      ></path>
      <path
        d="M419.404,58.936l-82.933,67.896c-23.335-14.586-50.919-23.012-80.471-23.012
	c-66.729,0-123.429,42.957-143.965,102.724l-83.397-68.276h-0.014C71.23,56.123,157.06,0,256,0
	C318.115,0,375.068,22.126,419.404,58.936z"
        style={{ fill: "#F14336" }}
      ></path>
    </svg>
  ),
  github: (props: IconProps) => (
    <svg
      {...props}
      width={24}
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-2"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.49936 0.850006C3.82767 0.850006 0.849976 3.8273 0.849976 7.50023C0.849976 10.4379 2.75523 12.9306 5.39775 13.8104C5.73047 13.8712 5.85171 13.6658 5.85171 13.4895C5.85171 13.3315 5.846 12.9135 5.84273 12.3587C3.99301 12.7604 3.60273 11.4671 3.60273 11.4671C3.30022 10.6988 2.86423 10.4942 2.86423 10.4942C2.26044 10.0819 2.90995 10.0901 2.90995 10.0901C3.57742 10.137 3.9285 10.7755 3.9285 10.7755C4.52167 11.7916 5.48512 11.4981 5.86396 11.3279C5.92438 10.8984 6.09625 10.6053 6.28608 10.4391C4.80948 10.2709 3.25695 9.70063 3.25695 7.15241C3.25695 6.42615 3.51618 5.83298 3.94157 5.368C3.87299 5.1998 3.64478 4.52375 4.00689 3.60807C4.00689 3.60807 4.56494 3.42926 5.83538 4.28941C6.36568 4.14204 6.93477 4.06856 7.50018 4.0657C8.06518 4.06856 8.63386 4.14204 9.16498 4.28941C10.4346 3.42926 10.9918 3.60807 10.9918 3.60807C11.3548 4.52375 11.1266 5.1998 11.0584 5.368C11.4846 5.83298 11.7418 6.42615 11.7418 7.15241C11.7418 9.70716 10.1868 10.2693 8.70571 10.4338C8.94412 10.6392 9.15681 11.045 9.15681 11.6655C9.15681 12.5542 9.14865 13.2715 9.14865 13.4895C9.14865 13.6675 9.26867 13.8745 9.60588 13.8095C12.2464 12.9282 14.15 10.4375 14.15 7.50023C14.15 3.8273 11.1723 0.850006 7.49936 0.850006Z"
        fill="#000000"
      />
    </svg>
  ),
  search: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      width="64px"
      height="64px"
      {...props}
    >
      <path
        fill="#fff"
        d="M108.9,108.9L108.9,108.9c-2.3,2.3-6.1,2.3-8.5,0L87.7,96.2c-2.3-2.3-2.3-6.1,0-8.5l0,0c2.3-2.3,6.1-2.3,8.5,0l12.7,12.7C111.2,102.8,111.2,106.6,108.9,108.9z"
      />
      <path
        fill="#fff"
        d="M52.3 17.299999999999997A35 35 0 1 0 52.3 87.3A35 35 0 1 0 52.3 17.299999999999997Z"
        transform="rotate(-45.001 52.337 52.338)"
      />
      <path
        fill="#fff"
        d="M52.3 17.299999999999997A35 35 0 1 0 52.3 87.3A35 35 0 1 0 52.3 17.299999999999997Z"
        transform="rotate(-45.001 52.337 52.338)"
      />
      <path
        fill="#adf9d2"
        d="M52.3 84.3c-1.7 0-3-1.3-3-3s1.3-3 3-3c6.9 0 13.5-2.7 18.4-7.6 6.4-6.4 9-15.5 6.9-24.4-.4-1.6.6-3.2 2.2-3.6 1.6-.4 3.2.6 3.6 2.2C86 55.8 82.9 67.1 75 75 68.9 81 60.9 84.3 52.3 84.3zM72.9 35c-.8 0-1.5-.3-2.1-.9L70.8 34c-1.2-1.2-1.2-3.1 0-4.3 1.2-1.2 3-1.2 4.2 0l.1.1c1.2 1.2 1.2 3.1 0 4.3C74.5 34.7 73.7 35 72.9 35z"
      />
      <path
        fill="#444b54"
        d="M52.3 90.3c-9.7 0-19.5-3.7-26.9-11.1-14.8-14.8-14.8-38.9 0-53.7 14.8-14.8 38.9-14.8 53.7 0 0 0 0 0 0 0C94 40.3 94 64.4 79.2 79.2 71.8 86.6 62.1 90.3 52.3 90.3zM52.3 20.4c-8.2 0-16.4 3.1-22.6 9.4-12.5 12.5-12.5 32.8 0 45.3C42.2 87.4 62.5 87.4 75 75c12.5-12.5 12.5-32.8 0-45.3C68.7 23.5 60.5 20.4 52.3 20.4zM111 98.3L98.3 85.6c-1.7-1.7-4-2.6-6.4-2.6-1.4 0-2.7.3-3.9.9l-2.5-2.5c-1.2-1.2-3.1-1.2-4.2 0-1.2 1.2-1.2 3.1 0 4.2l2.5 2.5c-1.6 3.3-1 7.5 1.7 10.2L98.3 111c1.8 1.8 4.1 2.6 6.4 2.6s4.6-.9 6.4-2.6c0 0 0 0 0 0 1.7-1.7 2.6-4 2.6-6.4C113.7 102.3 112.7 100 111 98.3zM106.8 106.8C106.8 106.8 106.8 106.8 106.8 106.8c-1.2 1.2-3.1 1.2-4.2 0L89.8 94.1c-1.2-1.2-1.2-3.1 0-4.2 0 0 0 0 0 0 0 0 0 0 0 0 .6-.6 1.3-.9 2.1-.9.8 0 1.6.3 2.1.9l12.7 12.7c.6.6.9 1.3.9 2.1S107.4 106.2 106.8 106.8z"
      />
    </svg>
  ),
  sun: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      viewBox="0 0 30 30"
      width="30px"
      height="30px"
    >
      <circle cx="15" cy="15" r="7" />
      <line
        style={{
          fill: "none",
          stroke: "#000000",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
        }}
        x1="15"
        y1="2"
        x2="15"
        y2="5"
      />
      <line
        style={{
          fill: "none",
          stroke: "#000000",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
        }}
        x1="15"
        y1="25"
        x2="15"
        y2="28"
      />
      <line
        style={{
          fill: "none",
          stroke: "#000000",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
        }}
        x1="28"
        y1="15"
        x2="25"
        y2="15"
      />
      <line
        style={{
          fill: "none",
          stroke: "#000000",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
        }}
        x1="5"
        y1="15"
        x2="2"
        y2="15"
      />
      <line
        style={{
          fill: "none",
          stroke: "#000000",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
        }}
        x1="24.192"
        y1="5.808"
        x2="22.071"
        y2="7.929"
      />
      <line
        style={{
          fill: "none",
          stroke: "#000000",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
        }}
        x1="7.929"
        y1="22.071"
        x2="5.808"
        y2="24.192"
      />
      <line
        style={{
          fill: "none",
          stroke: "#000000",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
        }}
        x1="24.192"
        y1="24.192"
        x2="22.071"
        y2="22.071"
      />
      <line
        style={{
          fill: "none",
          stroke: "#000000",
          strokeWidth: 2,
          strokeLinecap: "round",
          strokeMiterlimit: 10,
        }}
        x1="7.929"
        y1="7.929"
        x2="5.808"
        y2="5.808"
      />
    </svg>
  ),
  moon: (props: IconProps) => (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      {...props}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  rightArrow: (props: IconProps) => (
    <svg
      height="800px"
      width="800px"
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
      viewBox="0 0 330 330"
      fill="hsl(var(--background))"
    >
      <path
        id="XMLID_27_"
        d="M15,180h263.787l-49.394,49.394c-5.858,5.857-5.858,15.355,0,21.213C232.322,253.535,236.161,255,240,255
      s7.678-1.465,10.606-4.394l75-75c5.858-5.857,5.858-15.355,0-21.213l-75-75c-5.857-5.857-15.355-5.857-21.213,0
      c-5.858,5.857-5.858,15.355,0,21.213L278.787,150H15c-8.284,0-15,6.716-15,15S6.716,180,15,180z"
      />
    </svg>
  ),
  openbook: (props: IconProps) => (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 10.4V20M12 10.4C12 8.15979 12 7.03969 11.564 6.18404C11.1805 5.43139 10.5686 4.81947 9.81596 4.43597C8.96031 4 7.84021 4 5.6 4H4.6C4.03995 4 3.75992 4 3.54601 4.10899C3.35785 4.20487 3.20487 4.35785 3.10899 4.54601C3 4.75992 3 5.03995 3 5.6V16.4C3 16.9601 3 17.2401 3.10899 17.454C3.20487 17.6422 3.35785 17.7951 3.54601 17.891C3.75992 18 4.03995 18 4.6 18H7.54668C8.08687 18 8.35696 18 8.61814 18.0466C8.84995 18.0879 9.0761 18.1563 9.29191 18.2506C9.53504 18.3567 9.75977 18.5065 10.2092 18.8062L12 20M12 10.4C12 8.15979 12 7.03969 12.436 6.18404C12.8195 5.43139 13.4314 4.81947 14.184 4.43597C15.0397 4 16.1598 4 18.4 4H19.4C19.9601 4 20.2401 4 20.454 4.10899C20.6422 4.20487 20.7951 4.35785 20.891 4.54601C21 4.75992 21 5.03995 21 5.6V16.4C21 16.9601 21 17.2401 20.891 17.454C20.7951 17.6422 20.6422 17.7951 20.454 17.891C20.2401 18 19.9601 18 19.4 18H16.4533C15.9131 18 15.643 18 15.3819 18.0466C15.15 18.0879 14.9239 18.1563 14.7081 18.2506C14.465 18.3567 14.2402 18.5065 13.7908 18.8062L12 20"
        stroke="#000000"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  piText: (props: IconProps) => (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 256 256"
      height="200px"
      width="200px"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M90.86,50.89a12,12,0,0,0-21.72,0l-64,136a12,12,0,0,0,21.71,10.22L42.44,164h75.12l15.58,33.11a12,12,0,0,0,21.72-10.22ZM53.74,140,80,84.18,106.27,140ZM200,84c-13.85,0-24.77,3.86-32.45,11.48a12,12,0,1,0,16.9,17c3-3,8.26-4.52,15.55-4.52,11,0,20,7.18,20,16v4.39A47.28,47.28,0,0,0,200,124c-24.26,0-44,17.94-44,40s19.74,40,44,40a47.18,47.18,0,0,0,22-5.38A12,12,0,0,0,244,192V124C244,101.94,224.26,84,200,84Zm0,96c-11,0-20-7.18-20-16s9-16,20-16,20,7.18,20,16S211,180,200,180Z"></path>
    </svg>
  ),
};
