import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { UserNotification } from "../../../models/notification.model";
import { DeleteIcon } from "../../../components/icons";
import { NotificationsService } from "../../../services/notifications.service";
import { MouseEvent, useState } from "react";

export function NotificationCard(props: { data: UserNotification }) {
  const data = props.data.values;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onDelete = async () => {
    const service = new NotificationsService();
    await service.delete(data.id);
  };

  const onView = async () => {
    const service = new NotificationsService();
    await service.update(data.id, { viewed: true });
  };

  return (
    <Paper
      sx={{
        paddingRight: 1.5,
        overflow: "hidden",
        borderRadius: 1.5,
        maxWidth: "100%",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        maxWidth="100%"
      >
        <Stack direction="row" alignItems="center" maxWidth={"100%"}>
          {data.imageLink ? (
            <Box
              component="img"
              src={data.imageLink}
              alt={data.title}
              sx={(theme) => ({
                width: [150, 200],
                height: [100, 120],
                display: "none",
                [theme.breakpoints.up(450)]: {
                  display: "inline-block",
                },
              })}
            />
          ) : null}
          <Box paddingLeft={1.5} paddingY={1.5} maxWidth={[200, "100%"]}>
            <Typography
              component="h2"
              variant="h6"
              fontWeight="bold"
              sx={{
                maxWidth: "100%",
                whiteSpace: ["nowrap", "normal"],
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {data.title}
            </Typography>
            <Typography
              component="p"
              variant="body1"
              sx={{
                maxWidth: "100%",
                whiteSpace: ["nowrap", "normal"],
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
            >
              {data.description}
            </Typography>
          </Box>
        </Stack>
        <IconButton
          aria-label="more"
          id="long-button"
          aria-controls={open ? "long-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup="true"
          onClick={handleClick}
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 30 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.28125 12.1875C5.71215 12.1875 6.13883 12.2724 6.53693 12.4373C6.93503 12.6022 7.29675 12.8439 7.60144 13.1486C7.90614 13.4532 8.14783 13.815 8.31273 14.2131C8.47763 14.6112 8.5625 15.0379 8.5625 15.4688C8.5625 15.8996 8.47763 16.3263 8.31273 16.7244C8.14783 17.1225 7.90614 17.4843 7.60144 17.7889C7.29675 18.0936 6.93503 18.3353 6.53693 18.5002C6.13883 18.6651 5.71215 18.75 5.28125 18.75C4.41101 18.75 3.57641 18.4043 2.96106 17.7889C2.3457 17.1736 2 16.339 2 15.4688C2 14.5985 2.3457 13.7639 2.96106 13.1486C3.57641 12.5332 4.41101 12.1875 5.28125 12.1875ZM15.125 12.1875C15.5559 12.1875 15.9826 12.2724 16.3807 12.4373C16.7788 12.6022 17.1405 12.8439 17.4452 13.1486C17.7499 13.4532 17.9916 13.815 18.1565 14.2131C18.3214 14.6112 18.4062 15.0379 18.4062 15.4688C18.4062 15.8996 18.3214 16.3263 18.1565 16.7244C17.9916 17.1225 17.7499 17.4843 17.4452 17.7889C17.1405 18.0936 16.7788 18.3353 16.3807 18.5002C15.9826 18.6651 15.5559 18.75 15.125 18.75C14.2548 18.75 13.4202 18.4043 12.8048 17.7889C12.1895 17.1736 11.8438 16.339 11.8438 15.4688C11.8438 14.5985 12.1895 13.7639 12.8048 13.1486C13.4202 12.5332 14.2548 12.1875 15.125 12.1875ZM24.9688 12.1875C25.3997 12.1875 25.8263 12.2724 26.2244 12.4373C26.6225 12.6022 26.9843 12.8439 27.2889 13.1486C27.5936 13.4532 27.8353 13.815 28.0002 14.2131C28.1651 14.6112 28.25 15.0379 28.25 15.4688C28.25 15.8996 28.1651 16.3263 28.0002 16.7244C27.8353 17.1225 27.5936 17.4843 27.2889 17.7889C26.9843 18.0936 26.6225 18.3353 26.2244 18.5002C25.8263 18.6651 25.3997 18.75 24.9688 18.75C24.0985 18.75 23.2639 18.4043 22.6486 17.7889C22.0332 17.1736 21.6875 16.339 21.6875 15.4688C21.6875 14.5985 22.0332 13.7639 22.6486 13.1486C23.2639 12.5332 24.0985 12.1875 24.9688 12.1875Z"
              fill="#C81973"
            />
          </svg>
        </IconButton>
        <Menu
          id="long-menu"
          MenuListProps={{
            "aria-labelledby": "long-button",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem
            onClick={async () => {
              await onView();
              handleClose();
            }}
          >
            <ListItemIcon>
              <svg
                width="25"
                height="25"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_104_210)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.773 2.5555C10.9136 2.69615 10.9926 2.88688 10.9926 3.08575C10.9926 3.28463 10.9136 3.47536 10.773 3.616L5.15151 9.2375C5.07722 9.31181 4.98902 9.37075 4.89195 9.41097C4.79488 9.45118 4.69084 9.47188 4.58576 9.47188C4.48069 9.47188 4.37665 9.45118 4.27957 9.41097C4.1825 9.37075 4.0943 9.31181 4.02001 9.2375L1.22701 6.445C1.15538 6.37582 1.09824 6.29306 1.05894 6.20156C1.01963 6.11005 0.998941 6.01164 0.998075 5.91205C0.99721 5.81247 1.01619 5.71371 1.0539 5.62154C1.09161 5.52936 1.1473 5.44563 1.21772 5.37521C1.28814 5.30479 1.37188 5.2491 1.46405 5.21139C1.55622 5.17368 1.65498 5.1547 1.75456 5.15556C1.85415 5.15643 1.95256 5.17712 2.04407 5.21643C2.13557 5.25573 2.21833 5.31287 2.28751 5.3845L4.58551 7.6825L9.71201 2.5555C9.78166 2.48581 9.86436 2.43052 9.95539 2.3928C10.0464 2.35508 10.144 2.33566 10.2425 2.33566C10.341 2.33566 10.4386 2.35508 10.5296 2.3928C10.6207 2.43052 10.7034 2.48581 10.773 2.5555Z"
                    fill="#1973C8"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_104_210">
                    <rect width="25" height="25" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </ListItemIcon>
            <ListItemText>Marcar como leída</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={async () => {
              await onDelete();
              handleClose();
            }}
          >
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText>Eliminar notificación</ListItemText>
          </MenuItem>
        </Menu>
      </Stack>
    </Paper>
  );
}
