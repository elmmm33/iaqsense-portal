import moment from 'moment';

const toHKTimeString = (input, options) => {
  let format = 'YYYY-MM-DD HH:mm:ss';
  if (options && options.format){
    format = options.format;
  }

  if (!input){
    return moment('0000-00-00 00:00:00').format(format);
  }

  if (typeof input === 'number'){
    return moment(`${input}` , 'x').utcOffset(8).format(format);
  }

  if (typeof input === 'Date'){
    return moment(input).utcOffset(8).format(format);
  }

  if (input.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/)){
    //YYYY-MM-DDTHH:mm:ss.sssZ
    let time = moment(input);
    return time.utcOffset(8).format(format);
  }

  if (input.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)){
    //YYYY-MM-DDTHH:mm:ss
    let time = moment(input, 'YYYY-MM-DDTHH:mm:ss');
    return time.format(format);
  }


  let time = moment(input).utcOffset(8);
  return time.format(format);
}

export default toHKTimeString;