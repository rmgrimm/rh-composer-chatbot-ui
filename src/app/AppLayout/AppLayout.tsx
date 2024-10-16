import * as React from 'react';
import { NavLink, Outlet, useLoaderData, useLocation } from 'react-router-dom';
import {
  Button,
  Masthead,
  MastheadBrand,
  MastheadLogo,
  MastheadMain,
  MastheadToggle,
  Nav,
  NavExpandable,
  NavItem,
  NavList,
  Page,
  PageSidebar,
  PageSidebarBody,
  SkipToContent,
} from '@patternfly/react-core';
import { IAppRoute, IAppRouteGroup, routes as staticRoutes } from '@app/routes';
import { BarsIcon } from '@patternfly/react-icons';
import { CannedChatbot } from '../types/CannedChatbot';

const getChatbots = () => {
  const url = process.env.REACT_APP_INFO_URL ?? '';
  return fetch(url)
    .then((res) => res.json())
    .then((data: CannedChatbot[]) => {
      return data;
    })
    .catch((e) => {
      throw new Response(e.message, { status: 404 });
    });
};

export async function loader() {
  const chatbots = await getChatbots();
  return { chatbots };
}

const AppLayout: React.FunctionComponent = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [routes, setRoutes] = React.useState(staticRoutes);
  const { chatbots } = useLoaderData() as { chatbots: CannedChatbot[] };

  React.useEffect(() => {
    if (chatbots) {
      const newRoutes = structuredClone(routes);
      chatbots.forEach((chatbot) => {
        const isNotPresent =
          routes.filter((route) => {
            if ('path' in route) {
              return route.path === `assistants/${chatbot.name}`;
            }
            return false;
          }).length === 0;
        if (isNotPresent) {
          newRoutes.push({
            path: `assistants/${chatbot.name}`,
            label: chatbot.displayName,
            title: chatbot.displayName,
          });
        }
      });
      setRoutes(newRoutes);
    }
  }, []);

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadToggle>
          <Button
            icon={<BarsIcon />}
            variant="plain"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Global navigation"
          />
        </MastheadToggle>
        <MastheadBrand data-codemods>
          <MastheadLogo data-codemods>
            <svg height="40px" viewBox="0 0 1076 165" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1053.29 148.524C1049.09 148.524 1045.29 147.554 1041.9 145.615C1038.5 143.675 1035.81 141.063 1033.82 137.776C1031.82 134.49 1030.83 130.8 1030.83 126.706C1030.83 122.612 1031.8 118.922 1033.74 115.636C1035.73 112.296 1038.42 109.656 1041.82 107.717C1045.26 105.777 1049.09 104.808 1053.29 104.808C1057.49 104.808 1061.29 105.777 1064.68 107.717C1068.13 109.656 1070.83 112.296 1072.77 115.636C1074.76 118.922 1075.76 122.612 1075.76 126.706C1075.76 130.8 1074.76 134.49 1072.77 137.776C1070.83 141.063 1068.16 143.675 1064.77 145.615C1061.37 147.554 1057.55 148.524 1053.29 148.524ZM1053.29 138.908C1055.5 138.908 1057.47 138.369 1059.19 137.292C1060.97 136.214 1062.37 134.76 1063.39 132.928C1064.47 131.043 1065.01 128.969 1065.01 126.706C1065.01 124.39 1064.47 122.316 1063.39 120.484C1062.37 118.652 1060.97 117.198 1059.19 116.12C1057.47 114.989 1055.5 114.424 1053.29 114.424C1051.14 114.424 1049.17 114.989 1047.39 116.12C1045.61 117.198 1044.21 118.652 1043.19 120.484C1042.17 122.316 1041.66 124.39 1041.66 126.706C1041.66 128.969 1042.17 131.043 1043.19 132.928C1044.21 134.76 1045.61 136.214 1047.39 137.292C1049.17 138.369 1051.14 138.908 1053.29 138.908Z"
                fill="black"
              />
              <path
                d="M1013.04 147.716V105.616H1024.11V147.716H1013.04ZM1018.53 100.606C1016.81 100.606 1015.33 99.9862 1014.09 98.7472C1012.85 97.5082 1012.23 96.0267 1012.23 94.3029C1012.23 92.5251 1012.85 91.0437 1014.09 89.8585C1015.33 88.6195 1016.81 88 1018.53 88C1020.31 88 1021.79 88.6195 1022.98 89.8585C1024.22 91.0437 1024.84 92.5251 1024.84 94.3029C1024.84 96.0267 1024.22 97.5082 1022.98 98.7472C1021.79 99.9862 1020.31 100.606 1018.53 100.606Z"
                fill="black"
              />
              <path
                d="M981.535 148.281C977.549 148.281 973.939 147.312 970.707 145.372C967.475 143.433 964.889 140.847 962.95 137.615C961.064 134.329 960.122 130.666 960.122 126.625C960.122 122.585 961.064 118.949 962.95 115.716C964.889 112.43 967.502 109.845 970.788 107.959C974.074 106.02 977.764 105.05 981.858 105.05C983.959 105.05 985.98 105.346 987.919 105.939C989.858 106.478 991.663 107.286 993.333 108.363V91.1514L1004.4 89.2928V147.716H993.495V144.241C990.047 146.935 986.06 148.281 981.535 148.281ZM983.313 138.827C985.36 138.827 987.219 138.504 988.889 137.857C990.612 137.157 992.094 136.133 993.333 134.787V118.383C992.094 117.144 990.612 116.174 988.889 115.474C987.165 114.774 985.306 114.424 983.313 114.424C980.997 114.424 978.896 114.962 977.01 116.04C975.178 117.063 973.724 118.518 972.647 120.403C971.569 122.235 971.03 124.309 971.03 126.625C971.03 128.942 971.569 131.016 972.647 132.847C973.724 134.679 975.178 136.133 977.01 137.211C978.896 138.288 980.997 138.827 983.313 138.827Z"
                fill="black"
              />
              <path
                d="M930.485 148.524C927.253 148.524 924.371 147.823 921.839 146.423C919.361 144.968 917.395 142.975 915.94 140.443C914.54 137.911 913.839 135.002 913.839 131.716V105.616H924.91V130.1C924.91 132.793 925.691 134.948 927.253 136.564C928.869 138.181 931.024 138.989 933.718 138.989C935.549 138.989 937.192 138.638 938.647 137.938C940.155 137.184 941.394 136.133 942.364 134.787V105.616H953.434V147.716H942.364V144.322C939.132 147.123 935.172 148.524 930.485 148.524Z"
                fill="black"
              />
              <path
                d="M899.872 148.362C895.186 148.362 891.63 147.312 889.206 145.211C886.836 143.056 885.651 139.931 885.651 135.837V114.827H877.004V105.616H885.651V94.8684L896.721 92.3634V105.616H908.761V114.827H896.721V133.574C896.721 135.514 897.152 136.914 898.014 137.776C898.876 138.584 900.384 138.989 902.539 138.989C903.617 138.989 904.586 138.935 905.448 138.827C906.364 138.665 907.361 138.396 908.438 138.019V147.15C907.307 147.527 905.879 147.823 904.155 148.039C902.485 148.254 901.058 148.362 899.872 148.362Z"
                fill="black"
              />
              <path
                d="M851.049 148.524C846.47 148.524 841.999 147.689 837.635 146.019C833.272 144.295 829.393 141.871 825.999 138.746L832.706 130.342C835.992 133.251 839.143 135.352 842.16 136.645C845.231 137.938 848.463 138.585 851.857 138.585C854.227 138.585 856.274 138.315 857.998 137.777C859.722 137.184 861.042 136.349 861.958 135.272C862.927 134.194 863.412 132.928 863.412 131.474C863.412 129.534 862.712 128.053 861.311 127.029C859.911 125.952 857.513 125.117 854.12 124.524L842.888 122.585C838.093 121.777 834.43 120.08 831.898 117.494C829.42 114.908 828.181 111.568 828.181 107.474C828.181 103.973 829.07 100.929 830.847 98.3432C832.679 95.7574 835.238 93.7911 838.524 92.4443C841.864 91.0437 845.823 90.3434 850.402 90.3434C854.55 90.3434 858.672 91.0437 862.766 92.4443C866.914 93.845 870.577 95.7843 873.755 98.2624L867.453 106.989C861.527 102.464 855.574 100.202 849.594 100.202C847.493 100.202 845.662 100.471 844.1 101.01C842.537 101.548 841.325 102.303 840.463 103.272C839.655 104.188 839.251 105.293 839.251 106.585C839.251 108.309 839.871 109.656 841.11 110.626C842.349 111.542 844.423 112.242 847.332 112.727L857.998 114.504C863.655 115.42 867.884 117.225 870.685 119.918C873.486 122.558 874.887 126.06 874.887 130.423C874.887 134.086 873.917 137.292 871.978 140.039C870.038 142.733 867.264 144.834 863.655 146.342C860.099 147.796 855.897 148.524 851.049 148.524Z"
                fill="black"
              />
              <path d="M792.574 147.715V91.1509H804.291V147.715H792.574Z" fill="black" />
              <path
                d="M727.976 147.715L751.248 91.1509H764.743L787.773 147.715H775.086L769.349 132.847H745.996L740.178 147.715H727.976ZM749.632 123.473H765.793L757.713 102.625L749.632 123.473Z"
                fill="black"
              />
              <path
                d="M683.422 147.715V105.615H694.492V110.302C695.839 108.47 697.455 107.07 699.341 106.1C701.226 105.13 703.354 104.646 705.724 104.646C707.771 104.699 709.307 105.023 710.33 105.615V115.312C709.522 114.935 708.633 114.665 707.664 114.504C706.694 114.288 705.697 114.181 704.674 114.181C702.519 114.181 700.553 114.719 698.775 115.797C696.997 116.874 695.57 118.409 694.492 120.403V147.715H683.422Z"
                fill="black"
              />
              <path
                d="M656.68 148.523C652.478 148.523 648.653 147.554 645.206 145.614C641.812 143.675 639.118 141.062 637.125 137.776C635.132 134.49 634.135 130.8 634.135 126.706C634.135 122.611 635.078 118.921 636.963 115.635C638.903 112.349 641.516 109.736 644.802 107.797C648.088 105.858 651.751 104.888 655.791 104.888C659.832 104.888 663.414 105.885 666.538 107.878C669.663 109.871 672.114 112.565 673.892 115.958C675.723 119.352 676.639 123.204 676.639 127.514V130.423H645.448C645.933 132.093 646.714 133.601 647.791 134.948C648.923 136.295 650.296 137.345 651.913 138.099C653.583 138.853 655.36 139.231 657.246 139.231C659.131 139.231 660.855 138.934 662.417 138.342C664.034 137.749 665.407 136.914 666.538 135.837L673.811 142.463C671.225 144.564 668.559 146.099 665.811 147.069C663.118 148.038 660.074 148.523 656.68 148.523ZM645.287 122.504H665.73C665.353 120.834 664.653 119.379 663.629 118.14C662.66 116.847 661.475 115.851 660.074 115.15C658.727 114.396 657.219 114.019 655.549 114.019C653.825 114.019 652.263 114.369 650.862 115.07C649.461 115.77 648.276 116.766 647.307 118.059C646.391 119.298 645.717 120.78 645.287 122.504Z"
                fill="black"
              />
              <path
                d="M611.746 148.523C607.867 148.523 604.285 148.038 600.999 147.069C597.712 146.045 594.857 144.591 592.433 142.705L597.928 135.352C600.352 136.968 602.669 138.18 604.877 138.988C607.14 139.796 609.375 140.2 611.584 140.2C614.062 140.2 616.028 139.796 617.483 138.988C618.991 138.126 619.746 137.022 619.746 135.675C619.746 134.598 619.315 133.736 618.453 133.089C617.645 132.443 616.325 131.985 614.493 131.716L606.413 130.503C602.211 129.857 599.032 128.51 596.877 126.463C594.723 124.362 593.645 121.615 593.645 118.221C593.645 115.474 594.346 113.13 595.746 111.191C597.201 109.198 599.221 107.662 601.807 106.585C604.446 105.454 607.571 104.888 611.18 104.888C614.251 104.888 617.241 105.319 620.15 106.181C623.112 107.043 625.887 108.363 628.473 110.14L623.139 117.332C620.823 115.878 618.614 114.827 616.513 114.181C614.412 113.534 612.284 113.211 610.13 113.211C608.136 113.211 606.52 113.588 605.281 114.342C604.096 115.096 603.504 116.093 603.504 117.332C603.504 118.463 603.935 119.352 604.796 119.999C605.658 120.645 607.14 121.103 609.241 121.372L617.241 122.584C621.442 123.177 624.648 124.524 626.856 126.625C629.065 128.672 630.17 131.338 630.17 134.625C630.17 137.318 629.361 139.715 627.745 141.816C626.129 143.863 623.947 145.506 621.2 146.745C618.453 147.931 615.301 148.523 611.746 148.523Z"
                fill="black"
              />
              <path
                d="M566.718 148.524C562.517 148.524 558.719 147.554 555.325 145.615C551.931 143.675 549.237 141.063 547.244 137.776C545.251 134.49 544.254 130.8 544.254 126.706C544.254 122.612 545.224 118.922 547.163 115.636C549.157 112.296 551.85 109.656 555.244 107.717C558.692 105.777 562.517 104.808 566.718 104.808C570.92 104.808 574.718 105.777 578.112 107.717C581.56 109.656 584.253 112.296 586.193 115.636C588.186 118.922 589.183 122.612 589.183 126.706C589.183 130.8 588.186 134.49 586.193 137.776C584.253 141.063 581.587 143.675 578.193 145.615C574.799 147.554 570.974 148.524 566.718 148.524ZM566.718 138.908C568.927 138.908 570.893 138.369 572.617 137.292C574.395 136.214 575.796 134.76 576.819 132.928C577.897 131.043 578.435 128.969 578.435 126.706C578.435 124.39 577.897 122.316 576.819 120.484C575.796 118.652 574.395 117.198 572.617 116.12C570.893 114.989 568.927 114.424 566.718 114.424C564.564 114.424 562.597 114.989 560.82 116.12C559.042 117.198 557.641 118.652 556.618 120.484C555.594 122.316 555.082 124.39 555.082 126.706C555.082 128.969 555.594 131.043 556.618 132.928C557.641 134.76 559.042 136.214 560.82 137.292C562.597 138.369 564.564 138.908 566.718 138.908Z"
                fill="black"
              />
              <path
                d="M495.216 164.2V105.616H506.125V109.09C509.573 106.397 513.559 105.05 518.084 105.05C522.071 105.05 525.68 106.02 528.912 107.959C532.145 109.898 534.704 112.511 536.589 115.797C538.528 119.029 539.498 122.666 539.498 126.706C539.498 130.746 538.528 134.409 536.589 137.696C534.65 140.928 532.037 143.514 528.751 145.453C525.465 147.338 521.801 148.281 517.761 148.281C515.66 148.281 513.64 148.012 511.701 147.473C509.761 146.881 507.957 146.046 506.287 144.968V164.2H495.216ZM516.307 138.908C518.623 138.908 520.697 138.369 522.529 137.292C524.414 136.214 525.896 134.76 526.973 132.928C528.05 131.096 528.589 129.022 528.589 126.706C528.589 124.39 528.05 122.315 526.973 120.484C525.896 118.598 524.414 117.144 522.529 116.12C520.697 115.043 518.623 114.504 516.307 114.504C514.26 114.504 512.374 114.854 510.65 115.555C508.98 116.201 507.526 117.198 506.287 118.545V134.948C507.472 136.187 508.926 137.157 510.65 137.857C512.428 138.558 514.313 138.908 516.307 138.908Z"
                fill="black"
              />
              <path
                d="M422.064 147.716V105.616H433.135V108.848C436.152 106.154 439.815 104.808 444.125 104.808C446.872 104.808 449.323 105.373 451.478 106.505C453.633 107.582 455.41 109.117 456.811 111.11C458.535 109.063 460.555 107.501 462.872 106.424C465.242 105.346 467.855 104.808 470.71 104.808C473.888 104.808 476.662 105.535 479.033 106.989C481.457 108.39 483.342 110.356 484.689 112.888C486.09 115.366 486.79 118.275 486.79 121.615V147.716H475.8V123.231C475.8 120.484 475.073 118.329 473.619 116.767C472.164 115.151 470.225 114.343 467.801 114.343C466.131 114.343 464.595 114.693 463.195 115.393C461.848 116.094 460.69 117.144 459.72 118.545C459.774 119.029 459.828 119.514 459.882 119.999C459.936 120.484 459.962 121.023 459.962 121.615V147.716H448.892V123.231C448.892 120.484 448.165 118.329 446.71 116.767C445.31 115.151 443.397 114.343 440.973 114.343C439.303 114.343 437.795 114.666 436.448 115.312C435.155 115.959 434.051 116.929 433.135 118.221V147.716H422.064Z"
                fill="black"
              />
              <path
                d="M392.796 148.524C388.594 148.524 384.796 147.554 381.402 145.615C378.009 143.675 375.315 141.063 373.322 137.776C371.329 134.49 370.332 130.8 370.332 126.706C370.332 122.612 371.302 118.922 373.241 115.636C375.234 112.296 377.928 109.656 381.322 107.717C384.769 105.777 388.594 104.808 392.796 104.808C396.998 104.808 400.796 105.777 404.19 107.717C407.638 109.656 410.331 112.296 412.27 115.636C414.264 118.922 415.26 122.612 415.26 126.706C415.26 130.8 414.264 134.49 412.27 137.776C410.331 141.063 407.664 143.675 404.271 145.615C400.877 147.554 397.052 148.524 392.796 148.524ZM392.796 138.908C395.005 138.908 396.971 138.369 398.695 137.292C400.473 136.214 401.873 134.76 402.897 132.928C403.974 131.043 404.513 128.969 404.513 126.706C404.513 124.39 403.974 122.316 402.897 120.484C401.873 118.652 400.473 117.198 398.695 116.12C396.971 114.989 395.005 114.424 392.796 114.424C390.641 114.424 388.675 114.989 386.897 116.12C385.12 117.198 383.719 118.652 382.695 120.484C381.672 122.316 381.16 124.39 381.16 126.706C381.16 128.969 381.672 131.043 382.695 132.928C383.719 134.76 385.12 136.214 386.897 137.292C388.675 138.369 390.641 138.908 392.796 138.908Z"
                fill="black"
              />
              <path
                d="M344.06 148.523C339.858 148.523 335.925 147.796 332.262 146.342C328.599 144.833 325.394 142.759 322.646 140.12C319.953 137.48 317.825 134.409 316.263 130.908C314.754 127.352 314 123.527 314 119.433C314 115.285 314.754 111.46 316.263 107.959C317.825 104.403 319.98 101.306 322.727 98.6662C325.474 96.0265 328.653 93.9794 332.262 92.5249C335.925 91.0165 339.858 90.2623 344.06 90.2623C347.184 90.2623 350.201 90.6933 353.11 91.5552C356.019 92.4172 358.713 93.6292 361.191 95.1915C363.723 96.7537 365.878 98.6392 367.655 100.848L359.736 108.686C357.689 106.154 355.319 104.242 352.625 102.949C349.986 101.656 347.13 101.01 344.06 101.01C341.528 101.01 339.158 101.494 336.949 102.464C334.74 103.38 332.828 104.673 331.212 106.343C329.596 107.959 328.33 109.898 327.414 112.161C326.498 114.369 326.04 116.794 326.04 119.433C326.04 122.019 326.498 124.443 327.414 126.706C328.33 128.915 329.623 130.854 331.292 132.524C332.962 134.14 334.902 135.406 337.111 136.322C339.373 137.238 341.824 137.695 344.464 137.695C347.427 137.695 350.201 137.076 352.787 135.837C355.373 134.598 357.662 132.82 359.655 130.504L367.332 138.1C365.554 140.254 363.426 142.113 360.948 143.675C358.47 145.237 355.777 146.449 352.868 147.311C350.013 148.119 347.077 148.523 344.06 148.523Z"
                fill="black"
              />
              <path
                d="M316.6 63.2001V7.20007H342C344.9 7.20007 347.5 7.60007 349.8 8.50007C352.1 9.40007 354.1 10.5001 355.7 12.0001C357.3 13.5001 358.5 15.2001 359.4 17.2001C360.3 19.2001 360.7 21.4001 360.7 23.8001C360.7 27.4001 359.7 30.6001 357.6 33.3001C355.5 36.0001 352.7 38.0001 349.2 39.1001L361.7 63.2001H352.4L340.8 40.2001H325V63.2001H316.6ZM341.3 14.6001H325V33.3001H341.3C344.8 33.3001 347.5 32.4001 349.4 30.6001C351.3 28.8001 352.2 26.6001 352.2 24.0001C352.2 21.4001 351.3 19.2001 349.4 17.4001C347.6 15.5001 344.9 14.6001 341.3 14.6001Z"
                fill="black"
              />
              <path
                d="M364.1 42.8C364.1 39.9 364.6 37.2 365.7 34.6C366.8 32 368.2 29.8 370 27.9C371.8 26 374 24.5 376.5 23.4C379 22.3 381.7 21.8 384.5 21.8C387.3 21.8 389.9 22.3 392.3 23.4C394.7 24.5 396.8 26 398.5 27.9C400.2 29.8 401.6 32.0001 402.6 34.7001C403.6 37.3001 404.1 40.1 404.1 43.1V45.4001H372C372.5 48.8001 374.1 51.5 376.6 53.8C379.2 56 382.2 57.1 385.7 57.1C387.7 57.1 389.6 56.8 391.4 56.1C393.2 55.5 394.8 54.6 396 53.5L401.1 58.5C398.7 60.4 396.2 61.7 393.7 62.6C391.2 63.5 388.4 63.9001 385.3 63.9001C382.3 63.9001 379.5 63.4001 376.9 62.3001C374.3 61.2001 372 59.7001 370.1 57.9001C368.2 56.0001 366.7 53.8001 365.6 51.2001C364.6 48.6001 364.1 45.8 364.1 42.8ZM384.3 28.6C381.2 28.6 378.5 29.6 376.3 31.6C374.1 33.6 372.6 36.2001 372.1 39.4001H396.3C395.8 36.3001 394.4 33.7 392.1 31.6C389.8 29.6 387.2 28.6 384.3 28.6Z"
                fill="black"
              />
              <path
                d="M443.1 63.2V59.4C441.4 60.8 439.5 61.9 437.3 62.7C435.2 63.5 432.9 63.9 430.6 63.9C427.7 63.9 425 63.4 422.5 62.3C420 61.2 417.8 59.7 416 57.8C414.2 55.9 412.7 53.7 411.6 51.1C410.5 48.5 410 45.8 410 42.9C410 40 410.5 37.3 411.6 34.7C412.7 32.1 414.1 29.9 416 28C417.8 26.1 420 24.6 422.6 23.5C425.1 22.4 427.9 21.9 430.8 21.9C433.1 21.9 435.3 22.2 437.4 22.9C439.5 23.6 441.4 24.6 443.1 25.9V7.20002L451.1 5.40002V63.2H443.1ZM417.9 42.8C417.9 46.8 419.2 50.2 421.9 52.9C424.6 55.6 427.9 57 431.7 57C434 57 436.2 56.6 438.1 55.7C440 54.8 441.6 53.6 443 52.1V33.6C441.7 32.2 440.1 31 438.1 30.1C436.1 29.2 434 28.8 431.7 28.8C427.8 28.8 424.5 30.1 421.8 32.8C419.2 35.5 417.9 38.8 417.9 42.8Z"
                fill="black"
              />
              <path
                d="M478.1 63.2001V7.20007H486.5V31.2001H516.3V7.20007H524.7V63.2001H516.3V38.8001H486.5V63.2001H478.1Z"
                fill="black"
              />
              <path
                d="M547.2 64.0001C542.8 64.0001 539.2 62.8001 536.4 60.5001C533.6 58.2001 532.2 55.2001 532.2 51.6001C532.2 47.5001 533.8 44.5001 536.9 42.4001C540 40.3001 544 39.2001 548.7 39.2001C550.7 39.2001 552.6 39.4001 554.5 39.8001C556.4 40.2001 558.2 40.7001 559.8 41.4001V37.1001C559.8 34.2001 558.9 32.1001 557.2 30.6001C555.5 29.2001 553 28.4001 549.8 28.4001C547.8 28.4001 545.8 28.7001 543.8 29.3001C541.7 29.9001 539.5 30.7001 537.2 31.9001L534.2 25.9001C537.1 24.6001 539.9 23.5001 542.6 22.8001C545.3 22.1001 548.1 21.7001 550.9 21.7001C556.1 21.7001 560.2 23.0001 563.1 25.5001C566 28.0001 567.5 31.6001 567.5 36.3001V63.3001H559.7V59.8001C557.9 61.2001 556 62.3001 553.9 63.0001C551.9 63.6001 549.6 64.0001 547.2 64.0001ZM539.9 51.4001C539.9 53.4001 540.8 55.0001 542.5 56.2001C544.2 57.4001 546.4 58.0001 549.1 58.0001C551.2 58.0001 553.2 57.7001 555 57.0001C556.8 56.4001 558.4 55.4001 559.9 54.1001V47.0001C558.4 46.2001 556.8 45.6001 555.1 45.2001C553.4 44.8001 551.5 44.6001 549.4 44.6001C546.6 44.6001 544.4 45.2001 542.6 46.4001C540.8 47.6001 539.9 49.3001 539.9 51.4001Z"
                fill="black"
              />
              <path
                d="M580.6 53.2001V29.2001H572V22.5001H580.6V12.1001L588.5 10.2001V22.5001H600.5V29.2001H588.5V51.3001C588.5 53.4001 589 54.8001 589.9 55.7001C590.8 56.6001 592.4 57.0001 594.5 57.0001C595.7 57.0001 596.7 56.9001 597.5 56.8001C598.4 56.7001 599.3 56.4001 600.3 56.0001V62.7001C599.2 63.1001 597.9 63.4001 596.5 63.6001C595.1 63.8001 593.8 63.9001 592.7 63.9001C588.8 63.9001 585.7 63.0001 583.7 61.1001C581.7 59.4001 580.6 56.7001 580.6 53.2001Z"
                fill="black"
              />
              <path
                d="M127 90.2C139.5 90.2 157.6 87.6 157.6 72.7C157.6 71.5 157.6 70.4001 157.3 69.3001L149.8 37C148.1 29.9 146.6 26.7 134.1 20.4C124.4 15.4 103.3 7.30005 97 7.30005C91.2 7.30005 89.5 14.8 82.6 14.8C75.9 14.8 71 9.20005 64.7 9.20005C58.7 9.20005 54.8 13.3 51.8 21.7C51.8 21.7 43.4 45.4001 42.3 48.9001C42 49.5001 42 50.2 42 50.8C42 60 78.3 90.2 127 90.2ZM159.5 78.8C161.2 87 161.2 87.9 161.2 88.9C161.2 102.9 145.5 110.7 124.8 110.7C78 110.7 37.1 83.3 37.1 65.2C37.1 62.4 37.7 59.8001 38.6 57.9001C21.8 58.8001 0 61.8 0 81C0 112.5 74.6 151.3 133.7 151.3C179 151.3 190.4 130.8 190.4 114.7C190.3 101.9 179.4 87.4 159.5 78.8Z"
                fill="#EE0000"
              />
              <path
                d="M159.5 78.8001C161.2 87.0001 161.2 87.9001 161.2 88.9001C161.2 102.9 145.5 110.7 124.8 110.7C78.0001 110.7 37.1001 83.3 37.1001 65.2C37.1001 62.4 37.7001 59.8001 38.6001 57.9001L42.3001 48.8C42.0001 49.5 42.0001 50.2 42.0001 50.8C42.0001 60 78.3001 90.2 127 90.2C139.5 90.2 157.6 87.6 157.6 72.7C157.6 71.5 157.6 70.4001 157.3 69.3001L159.5 78.8001Z"
                fill="black"
              />
              <path
                d="M253.5 158.7C252.3 158.7 251.3 157.7 251.3 156.5V2.2C251.3 1 252.3 0 253.5 0C254.7 0 255.7 1 255.7 2.2V156.4C255.7 157.7 254.7 158.7 253.5 158.7Z"
                fill="black"
              />
            </svg>
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
    </Masthead>
  );

  const location = useLocation();

  const renderNavItem = (route: IAppRoute, index: number) => (
    <NavItem key={`${route.label}-${index}`} id={`${route.label}-${index}`} isActive={route.path === location.pathname}>
      <NavLink
        to={route.path}
        reloadDocument
        className={({ isActive, isPending, isTransitioning }) =>
          [isPending ? 'pending' : '', isActive ? 'active' : '', isTransitioning ? 'transitioning' : ''].join(' ')
        }
      >
        {route.label}
      </NavLink>
    </NavItem>
  );

  const renderNavGroup = (group: IAppRouteGroup, groupIndex: number) => (
    <NavExpandable
      key={`${group.label}-${groupIndex}`}
      id={`${group.label}-${groupIndex}`}
      title={group.label}
      isActive={group.routes.some((route) => route.path === location.pathname)}
    >
      {group.routes.map((route, idx) => route.label && renderNavItem(route, idx))}
    </NavExpandable>
  );

  const Navigation = (
    <Nav id="nav-primary-simple">
      <NavList id="nav-list-simple">
        {routes.map(
          (route, idx) => route.label && (!route.routes ? renderNavItem(route, idx) : renderNavGroup(route, idx)),
        )}
      </NavList>
    </Nav>
  );

  const Sidebar = (
    <PageSidebar>
      <PageSidebarBody>{Navigation}</PageSidebarBody>
    </PageSidebar>
  );

  const pageId = 'primary-app-container';

  const PageSkipToContent = (
    <SkipToContent
      onClick={(event) => {
        event.preventDefault();
        const primaryContentContainer = document.getElementById(pageId);
        primaryContentContainer && primaryContentContainer.focus();
      }}
      href={`#${pageId}`}
    >
      Skip to Content
    </SkipToContent>
  );

  return (
    <Page
      mainContainerId={pageId}
      masthead={masthead}
      sidebar={sidebarOpen && Sidebar}
      skipToContent={PageSkipToContent}
      isContentFilled
    >
      <Outlet />
    </Page>
  );
};

export { AppLayout };
