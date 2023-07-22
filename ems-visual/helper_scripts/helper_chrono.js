/**
 * ===[ INFO ]==================================================================
 * @brief Responsible file for fetching and calculating dates and timestamps 
 * @created 03-08-2022@17:44:07.005
 * @author isja_krass
 * @version 0.0.1
 * =============================================================================
 */

/// EXPORT MASTER FUNCTION ///
/**
 * This function produces an human readable timestamp string,
 * often used before log entrys.
 * @param {"local"|"date-now"|"onlytime"} timeShematic defines the timezone shematich fort the clock th work with
 * @param {number} maxLength maximum length a timestamp can have to enshure a uniform look
 * @param {boolean} [dissable] toggle timestamp generation
 * @return {string} human readable timestamp
 */
module.exports = function (timeShematic, maxLength, dissable) {
    if (dissable) {
        return "";
    };
    var dateNow = new Date();
    var timestampGeneric = "";
    switch (timeShematic) {

        default:
            timestampGeneric = dateNow.toLocaleString(); // DEFAULT: 'local'
        break;
        case "onlytime":
            timestampGeneric = dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds() + "." + dateNow.getMilliseconds();
        break;
        case "date-now":
            timestampGeneric = Date.now().toString();
        break;

    };
    var lengthAdded = maxLength - timestampGeneric.length;
    for(var step = 0; step < lengthAdded; step++){
        timestampGeneric = timestampGeneric + " ";
    };
    return timestampGeneric + " ";
};