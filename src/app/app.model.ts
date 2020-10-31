enum Tabs {
    VIEW_EVENTS = 'VIEW_EVENTS',
    ADD_EVENTS = 'ADD_EVENTS'
}

export type ITabNames = keyof typeof Tabs;

export interface ICreateEvent {
    attendees?: string[];
    description: string;
    end: string;
    hangoutLink: string;
    organizerEmail: string;
    start: string;
    updated?: string;
    title: string;
    speaker: string;
}