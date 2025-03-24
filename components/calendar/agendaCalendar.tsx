import React, { useRef, useCallback } from "react";
import { StyleSheet } from "react-native";
import {
    ExpandableCalendar,
    AgendaList,
    CalendarProvider,
    WeekCalendar,
} from "react-native-calendars";
import testIDs from "./testIDs";
import { agendaItems, getMarkedDates } from "./agendaItems";
import AgendaItem from "./AgendaItem";
import { getTheme, themeColor, lightThemeColor } from "./theme";

const leftArrowIcon = require("./previous.png");
const rightArrowIcon = require("./next.png");
const ITEMS: any[] = agendaItems;

interface Props {
    weekView?: boolean;
}

const ExpandableCalendarScreen = (props: Props) => {
    const { weekView } = props;
    const marked = useRef(getMarkedDates());
    const theme = useRef(getTheme());
    const todayBtnTheme = useRef({
        todayButtonTextColor: themeColor,
    });

    const renderItem = useCallback(({ item }: any) => {
        return <AgendaItem item={item} />;
    }, []);

    return (
        <CalendarProvider
            date={ITEMS[1]?.title}
            showTodayButton
            disabledOpacity={0.6}
            theme={todayBtnTheme.current}
            style={styles.calendar}
        >
            {weekView ? (
                <WeekCalendar
                    testID={testIDs.weekCalendar.CONTAINER}
                    firstDay={1}
                    markedDates={marked.current}
                />
            ) : (
                <ExpandableCalendar
                    testID={testIDs.expandableCalendar.CONTAINER}
                    theme={theme.current}
                    disableAllTouchEventsForDisabledDays
                    firstDay={1}
                    markedDates={marked.current}
                    leftArrowImageSource={leftArrowIcon}
                    rightArrowImageSource={rightArrowIcon}
                    animateScroll
                />
            )}
            <AgendaList
                sections={ITEMS}
                renderItem={renderItem}
                sectionStyle={styles.section}
            />
        </CalendarProvider>
    );
};

export default ExpandableCalendarScreen;

const styles = StyleSheet.create({
    calendar: {
        backgroundColor: "#ffffff",
        paddingTop: 20,
    },
    header: {
        backgroundColor: "#ffffff",
    },
    section: {
        backgroundColor: lightThemeColor,
        color: "grey",
        textTransform: "capitalize",
    },
});
