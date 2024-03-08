function convertDateTime(dateTimeString) {
    // Parse the input string into a Date object
    const dateTime = new Date(dateTimeString);

    // Extract hours, minutes, seconds, and date components
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const seconds = dateTime.getSeconds();
    const date = dateTime.getDate();
    const month = dateTime.getMonth() + 1; // Months are zero-based
    const year = dateTime.getFullYear();

    // Format the time components with leading zeros if needed
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;

    // Format the date components with leading zeros if needed
    const formattedDate = `${date.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;

    // Combine formatted time and date components
    return `${formattedTime} - ${formattedDate}`;
}
