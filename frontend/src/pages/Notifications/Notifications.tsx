import {
  Box,
  Chip,
  Container,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { Navbar } from "../../components";
import { useState } from "react";
import { UserNotification } from "../../models/notification.model";
import { NotificationCard } from "./components";
import { useNotifications } from "./hooks";
import { UserNotificationFilter } from "../../services/notifications.service";

export function Notifications() {
  const [filter, setFilter] = useState<UserNotificationFilter>({});
  const { notifications, loading } = useNotifications(filter);

  const loadingNotification = new UserNotification({
    id: "",
    description: "",
    imageLink: null,
    link: null,
    userId: "",
    title: "loading ...",
    viewed: false,
  });

  return (
    <>
      <Navbar />
      <Container component="main" sx={{ paddingBottom: 5 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" marginTop={1}>
          Notificaciónes
        </Typography>
        <Stack direction="row" spacing={1} marginY={1}>
          <Chip
            label="Todas"
            color={filter.viewed === undefined ? "primary" : "default"}
            onClick={() => setFilter({})}
          />
          <Chip
            label="No leídas"
            color={filter.viewed === false ? "primary" : "default"}
            onClick={() => setFilter({ viewed: false })}
          />
        </Stack>
        <Stack>
          {loading ? (
            <>
              <Skeleton>
                <NotificationCard data={loadingNotification} />
              </Skeleton>
              <Skeleton>
                <NotificationCard data={loadingNotification} />
              </Skeleton>
              <Skeleton>
                <NotificationCard data={loadingNotification} />
              </Skeleton>
              <Skeleton>
                <NotificationCard data={loadingNotification} />
              </Skeleton>
            </>
          ) : (
            <>
              {notifications ? (
                notifications.length === 0 ? (
                  <Box
                    display="grid"
                    sx={{ placeContent: "center", minHeight: "50vh" }}
                  >
                    <Box
                      component="img"
                      src="/sleep-cat.png"
                      alt="sleeping cat"
                      sx={{ transform: "translateY(70px) translateX(-26px)" }}
                    />
                    <Typography
                      component="p"
                      variant="h4"
                      fontWeight="bold"
                      textAlign="center"
                      zIndex={1}
                    >
                      No tienes notificaciones por ahora
                    </Typography>
                  </Box>
                ) : (
                  notifications.map((v) => (
                    <NotificationCard key={v.values.id} data={v} />
                  ))
                )
              ) : null}
            </>
          )}
        </Stack>
      </Container>
    </>
  );
}
