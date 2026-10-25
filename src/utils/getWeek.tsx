
function GetWeek(date: Date)  {
    const startOfWeek = new Date(date);

    //gets sunday as a start day of the week
    startOfWeek.setDate(date.getDate() - date.getDay());

    return Array.from({ length: 7 }, (_, index) => {

        //gets the first date(sunday)
        const currentDate = new Date(startOfWeek);
        
        //changes the date to the index date
        currentDate.setDate(startOfWeek.getDate() + index);

        return {
            day: currentDate.toLocaleDateString("en-US", {
                weekday: "short",
            }),
            date: currentDate.getDate(),
            fullDate: currentDate,
        };
    });
};

export default GetWeek;