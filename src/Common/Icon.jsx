export const ActionIcon = (props) => {
  return (
    <svg
      className={`${props.isActive && 'opacity-25'}`}
      width="25"
      height="16"
      viewBox="0 0 25 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8.66663 14.5C9.19706 14.5 9.70577 14.2893 10.0808 13.9142C10.4559 13.5391 10.6666 13.0304 10.6666 12.5C10.6666 11.9696 10.4559 11.4609 10.0808 11.0858C9.70577 10.7107 9.19706 10.5 8.66663 10.5C8.13619 10.5 7.62749 10.7107 7.25241 11.0858C6.87734 11.4609 6.66663 11.9696 6.66663 12.5C6.66663 13.0304 6.87734 13.5391 7.25241 13.9142C7.62749 14.2893 8.13619 14.5 8.66663 14.5ZM18.6666 14.5C19.1971 14.5 19.7058 14.2893 20.0808 13.9142C20.4559 13.5391 20.6666 13.0304 20.6666 12.5C20.6666 11.9696 20.4559 11.4609 20.0808 11.0858C19.7058 10.7107 19.1971 10.5 18.6666 10.5C18.1362 10.5 17.6275 10.7107 17.2524 11.0858C16.8773 11.4609 16.6666 11.9696 16.6666 12.5C16.6666 13.0304 16.8773 13.5391 17.2524 13.9142C17.6275 14.2893 18.1362 14.5 18.6666 14.5Z"
        stroke="black"
        stroke-width="1.5"
        stroke-miterlimit="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.7166 12.5H15.6666V2.1C15.6666 1.94087 15.6034 1.78826 15.4909 1.67574C15.3784 1.56321 15.2258 1.5 15.0666 1.5H1.66663M6.31663 12.5H4.26663C4.18783 12.5 4.10981 12.4845 4.03702 12.4543C3.96422 12.4242 3.89808 12.38 3.84236 12.3243C3.78665 12.2685 3.74245 12.2024 3.7123 12.1296C3.68215 12.0568 3.66663 11.9788 3.66663 11.9V7"
        stroke="black"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <path
        d="M2.66663 4.5H6.66663"
        stroke="black"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15.6666 4.5H21.2766C21.3926 4.50003 21.5061 4.53367 21.6033 4.59685C21.7006 4.66003 21.7775 4.75005 21.8246 4.856L23.6146 8.884C23.6487 8.96048 23.6664 9.04326 23.6666 9.127V11.9C23.6666 11.9788 23.6511 12.0568 23.621 12.1296C23.5908 12.2024 23.5466 12.2685 23.4909 12.3243C23.4352 12.38 23.369 12.4242 23.2962 12.4543C23.2234 12.4845 23.1454 12.5 23.0666 12.5H21.1666M15.6666 12.5H16.6666"
        stroke="black"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
  );
};
export const DateIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M18.75 1.87256L13.7456 1.87258V0.626953C13.7456 0.281641 13.4659 0.00195312 13.1206 0.00195312C12.7753 0.00195312 12.4956 0.281641 12.4956 0.626953V1.87227H7.49563V0.626953C7.49563 0.281641 7.21594 0.00195312 6.87063 0.00195312C6.52531 0.00195312 6.24563 0.281641 6.24563 0.626953V1.87227H1.25C0.559687 1.87227 0 2.43195 0 3.12227V18.7473C0 19.4376 0.559687 19.9973 1.25 19.9973H18.75C19.4403 19.9973 20 19.4376 20 18.7473V3.12227C20 2.43225 19.4403 1.87256 18.75 1.87256ZM18.75 18.7473H1.25V3.12227H6.24563V3.75195C6.24563 4.09725 6.52531 4.37695 6.87063 4.37695C7.21594 4.37695 7.49563 4.09725 7.49563 3.75195V3.12258H12.4956V3.75226C12.4956 4.09758 12.7753 4.37726 13.1206 4.37726C13.4659 4.37726 13.7456 4.09758 13.7456 3.75226V3.12258H18.75V18.7473ZM14.375 9.99756H15.625C15.97 9.99756 16.25 9.71756 16.25 9.37256V8.12256C16.25 7.77756 15.97 7.49756 15.625 7.49756H14.375C14.03 7.49756 13.75 7.77756 13.75 8.12256V9.37256C13.75 9.71756 14.03 9.99756 14.375 9.99756ZM14.375 14.9972H15.625C15.97 14.9972 16.25 14.7176 16.25 14.3722V13.1222C16.25 12.7772 15.97 12.4972 15.625 12.4972H14.375C14.03 12.4972 13.75 12.7772 13.75 13.1222V14.3722C13.75 14.7179 14.03 14.9972 14.375 14.9972ZM10.625 12.4972H9.375C9.03 12.4972 8.75 12.7772 8.75 13.1222V14.3722C8.75 14.7176 9.03 14.9972 9.375 14.9972H10.625C10.97 14.9972 11.25 14.7176 11.25 14.3722V13.1222C11.25 12.7776 10.97 12.4972 10.625 12.4972ZM10.625 7.49756H9.375C9.03 7.49756 8.75 7.77756 8.75 8.12256V9.37256C8.75 9.71756 9.03 9.99756 9.375 9.99756H10.625C10.97 9.99756 11.25 9.71756 11.25 9.37256V8.12256C11.25 7.77725 10.97 7.49756 10.625 7.49756ZM5.625 7.49756H4.375C4.03 7.49756 3.75 7.77756 3.75 8.12256V9.37256C3.75 9.71756 4.03 9.99756 4.375 9.99756H5.625C5.97 9.99756 6.25 9.71756 6.25 9.37256V8.12256C6.25 7.77725 5.97 7.49756 5.625 7.49756ZM5.625 12.4972H4.375C4.03 12.4972 3.75 12.7772 3.75 13.1222V14.3722C3.75 14.7176 4.03 14.9972 4.375 14.9972H5.625C5.97 14.9972 6.25 14.7176 6.25 14.3722V13.1222C6.25 12.7776 5.97 12.4972 5.625 12.4972Z"
        fill="black"
      />
    </svg>
  );
};
export const ExportIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 17V19C4 19.5304 4.21071 20.0391 4.58579 20.4142C4.96086 20.7893 5.46957 21 6 21H18C18.5304 21 19.0391 20.7893 19.4142 20.4142C19.7893 20.0391 20 19.5304 20 19V17M7 9L12 4M12 4L17 9M12 4V16"
        stroke="black"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
export const TickIcon = () => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.1744 9.63937C20.8209 9.27 20.4553 8.88938 20.3175 8.55469C20.19 8.24813 20.1825 7.74 20.175 7.24781C20.1609 6.33281 20.1459 5.29594 19.425 4.575C18.7041 3.85406 17.6672 3.83906 16.7522 3.825C16.26 3.8175 15.7519 3.81 15.4453 3.6825C15.1116 3.54469 14.73 3.17906 14.3606 2.82562C13.7137 2.20406 12.9788 1.5 12 1.5C11.0212 1.5 10.2872 2.20406 9.63937 2.82562C9.27 3.17906 8.88938 3.54469 8.55469 3.6825C8.25 3.81 7.74 3.8175 7.24781 3.825C6.33281 3.83906 5.29594 3.85406 4.575 4.575C3.85406 5.29594 3.84375 6.33281 3.825 7.24781C3.8175 7.74 3.81 8.24813 3.6825 8.55469C3.54469 8.88844 3.17906 9.27 2.82562 9.63937C2.20406 10.2863 1.5 11.0212 1.5 12C1.5 12.9788 2.20406 13.7128 2.82562 14.3606C3.17906 14.73 3.54469 15.1106 3.6825 15.4453C3.81 15.7519 3.8175 16.26 3.825 16.7522C3.83906 17.6672 3.85406 18.7041 4.575 19.425C5.29594 20.1459 6.33281 20.1609 7.24781 20.175C7.74 20.1825 8.24813 20.19 8.55469 20.3175C8.88844 20.4553 9.27 20.8209 9.63937 21.1744C10.2863 21.7959 11.0212 22.5 12 22.5C12.9788 22.5 13.7128 21.7959 14.3606 21.1744C14.73 20.8209 15.1106 20.4553 15.4453 20.3175C15.7519 20.19 16.26 20.1825 16.7522 20.175C17.6672 20.1609 18.7041 20.1459 19.425 19.425C20.1459 18.7041 20.1609 17.6672 20.175 16.7522C20.1825 16.26 20.19 15.7519 20.3175 15.4453C20.4553 15.1116 20.8209 14.73 21.1744 14.3606C21.7959 13.7137 22.5 12.9788 22.5 12C22.5 11.0212 21.7959 10.2872 21.1744 9.63937ZM16.2806 10.2806L11.0306 15.5306C10.961 15.6004 10.8783 15.6557 10.7872 15.6934C10.6962 15.7312 10.5986 15.7506 10.5 15.7506C10.4014 15.7506 10.3038 15.7312 10.2128 15.6934C10.1217 15.6557 10.039 15.6004 9.96937 15.5306L7.71937 13.2806C7.57864 13.1399 7.49958 12.949 7.49958 12.75C7.49958 12.551 7.57864 12.3601 7.71937 12.2194C7.86011 12.0786 8.05098 11.9996 8.25 11.9996C8.44902 11.9996 8.63989 12.0786 8.78063 12.2194L10.5 13.9397L15.2194 9.21937C15.2891 9.14969 15.3718 9.09442 15.4628 9.0567C15.5539 9.01899 15.6515 8.99958 15.75 8.99958C15.8485 8.99958 15.9461 9.01899 16.0372 9.0567C16.1282 9.09442 16.2109 9.14969 16.2806 9.21937C16.3503 9.28906 16.4056 9.37178 16.4433 9.46283C16.481 9.55387 16.5004 9.65145 16.5004 9.75C16.5004 9.84855 16.481 9.94613 16.4433 10.0372C16.4056 10.1282 16.3503 10.2109 16.2806 10.2806Z"
        fill="black"
      />
    </svg>
  );
};
export const EditIcon = () => {
  return (
    <svg
      className="cursor_pointer"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 5.99994L18 8.99994M13 19.9999H21M5 15.9999L4 19.9999L8 18.9999L19.586 7.41394C19.9609 7.03889 20.1716 6.53027 20.1716 5.99994C20.1716 5.46961 19.9609 4.961 19.586 4.58594L19.414 4.41394C19.0389 4.039 18.5303 3.82837 18 3.82837C17.4697 3.82837 16.9611 4.039 16.586 4.41394L5 15.9999Z"
        stroke="black"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};
export const DeleteIcon = () => {
  return (
    <svg
      className="cursor_pointer"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 19C6 19.5304 6.21071 20.0391 6.58579 20.4142C6.96086 20.7893 7.46957 21 8 21H16C16.5304 21 17.0391 20.7893 17.4142 20.4142C17.7893 20.0391 18 19.5304 18 19V7H6V19ZM8 9H16V19H8V9ZM15.5 4L14.5 3H9.5L8.5 4H5V6H19V4H15.5Z"
        fill="#E94057"
      />
    </svg>
  );
};
