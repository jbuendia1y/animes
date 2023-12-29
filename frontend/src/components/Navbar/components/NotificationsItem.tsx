import { Badge, ListItemIcon, MenuItem } from "@mui/material";
import { NotificationIcon } from "../../icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { NotificationsService } from "../../../services/notifications.service";

export function NotificationsItem() {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let subscribe = true;
    const service = new NotificationsService();
    service.find().then((v) => {
      if (subscribe) setTotal(v.values.meta.total);
    });
    return () => {
      subscribe = false;
    };
  }, []);

  return (
    <MenuItem component={Link} to="/notifications">
      <ListItemIcon>
        <Badge badgeContent={total} color="primary">
          <NotificationIcon width="25" height="25" />
        </Badge>
      </ListItemIcon>
      Notificaciones
    </MenuItem>
  );
}
