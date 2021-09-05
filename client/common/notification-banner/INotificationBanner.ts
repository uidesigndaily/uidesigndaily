

import {NotificationType} from "./NotificationType";



export interface INotificationBanner {
    show(type: NotificationType, title: string, message: string): void,
    clear(): void
}