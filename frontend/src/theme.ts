import { createTheme } from '@mui/material';

const theme = createTheme({
  components: {
    MuiTextField: {
      // Общие настройки для MuiTextField
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
      // Переопределение стилей для MuiTextField
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: '#000000', // цвет текста лейбла
          },
          '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
            color: '#000000', // цвет текста лейбла при сжатии
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            '& fieldset': {
              borderColor: '#000000', // цвет рамки текстового поля
            },
            '&:hover fieldset': {
              borderColor: '#ffffff', // цвет рамки текстового поля при наведении
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ffffff', // цвет рамки текстового поля при фокусировке
            },
            '& .MuiInputLabel-root': {
              color: '#ffffff', // цвет текста лейбла при фокусировке
            },
            '& .MuiOutlinedInput-input': {
              color: '#000000', // цвет текста внутри текстового поля
            },
          },
        },
      },
      // Варианты стилей для различных вариантов MuiTextField
      variants: [
        {
          props: { variant: 'filled' },
          style: {
            '& .MuiInputLabel-root': {
              color: '#000000', // цвет текста лейбла
            },
            '& .MuiInputLabel-shrink': {
              color: 'white', // цвет текста лейбла при сжатии
            },
            // '& .MuiFilledInput-root': {
            //   backgroundColor: 'rgba(255,255,255,0.49)', // цвет фона для текстового поля
            // },
          },
        },
        {
          props: { variant: 'standard' },
          style: {
            '& .MuiInputLabel-root': {
              color: '#000000', // цвет текста лейбла
            },
            '& .MuiInputLabel-shrink': {
              color: 'white', // цвет текста лейбла при сжатии
            },
            '& .MuiInputBase-input': {
              color: '#000000', // цвет текста внутри текстового поля
            },
          },
        },
      ],
    },
    MuiSelect: {
      // Переопределение стилей для MuiSelect
      styleOverrides: {
        icon: {
          color: '#ffffff', // цвет иконки селекта
        },
        select: {
          '&:focus': {
            backgroundColor: 'transparent', // убираем фон при фокусировке
          },
          '&.Mui-focused': {
            backgroundColor: 'transparent', // убираем фон при фокусировке
          },
          // '&:not([multiple]) option, &:not([multiple]) optgroup': {
          //   backgroundColor: 'rgba(255, 255, 255, 0.7)', // цвет фона для опций
          // },
          color: '#000000', // цвет текста в селекте
        },
      },
    },
    MuiMenuItem: {
      // Переопределение стилей для MuiMenuItem
      styleOverrides: {
        root: {
          color: 'black', // цвет текста опции в выпадающем списке
        },
      },
    },
    MuiFormControl: {
      // Переопределение стилей для MuiFormControl
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: '#000000', // цвет текста лейбла для MuiSelect
          },
          '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
            color: '#000000', // цвет текста лейбла при сжатии
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            '& fieldset': {
              borderColor: '#ffffff', // цвет рамки текстового поля
            },
            '&:hover fieldset': {
              borderColor: '#ffffff', // цвет рамки текстового поля при наведении
            },
            '&.Mui-focused fieldset': {
              borderColor: '#ffffff', // цвет рамки текстового поля при фокусировке
            },
          },
          '& .MuiSelect-root': {
            color: '#ffffff', // цвет текста внутри селекта
          },
          '& .MuiSelect-icon': {
            color: '#ffffff', // цвет иконки селекта
          },
        },
      },
    },
  },
});

export default theme;
