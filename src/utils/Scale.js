import {Dimensions,Text, TextInput} from 'react-native';

export const {height, width} = Dimensions.get('window');

// export const drawerWidth = (width * 90) / 100;
export const drawerWidth = (width * 0) / 100;

export const responsiveHeight = (h) => {
    return height * (h / 100);
};

export const responsiveWidth = (w) => {
    return width * (w / 100);
};

export const responsiveFontSize = (f) => {
    return Math.sqrt((height * height) + (width * width)) * (f / 100);
};

export function disableFontScaling() {
  if (Text.defaultProps == null) Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
  if (TextInput.defaultProps == null) TextInput.defaultProps = {};
  TextInput.defaultProps.allowFontScaling = false;
}