import { useEffect } from 'react';
import { Formik } from 'formik'
import * as Yup from 'yup'
import get from 'lodash/get'
import isArray from 'lodash/isArray'
import { usePostMain } from '@/hooks/crud'

const Main = ({
  url,
  method,
  params,
  children,
  fields,
  formid,
  validationSchema,
  onSuccess = () => {},
  onError = () => {},
  errors
}) => {

  useEffect(() => {
    const trackFormSubmission = () => {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'event': 'form_send',
        'formid': formid
      });
    };

    const form = document.getElementById(formid);

    if (form) {
      form.addEventListener('submit', trackFormSubmission);
    }

    return () => {
      if (form) {
        form.removeEventListener('submit', trackFormSubmission);
      };
    };
  }, [formid]);


  const { mutate, isSuccess, isLoading } = usePostMain()
  
  return (
    <Formik
      initialValues={
        isArray(fields)
          ? fields.reduce((prev, curr) => {
              return {
                ...prev,
                [curr.name]: get(curr, 'value', '')
              }
            }, {})
          : {}
      }
      enableReinitialize={true}
      validationSchema={() => {
        if (!isArray(fields)) {
          return Yup.object().shape({})
        }

        let validationFields = {}

        fields.forEach(field => {
          let validationField

          switch (field.type) {
            case 'string':
              validationField = Yup.string().typeError('Must be a string')
              break
            case 'object':
              validationField = Yup.object()
              break
            case 'number':
              validationField = Yup.number().typeError('Must be a number')
              break
            case 'array':
              validationField = Yup.array()
              break
            case 'email':
              validationField = Yup.string()
                .email('Must be a valid email address')
                .max(255)
                .typeError('Must be a valid email address')
              break
            case 'boolean':
              validationField = Yup.boolean()
              break
            case 'date':
              validationField = Yup.date()
              break
            default:
              validationField = Yup.string()
          }

          if (field.required) {
            validationField = validationField.required('Required')
          }

          if (field.min) {
            validationField = validationField.min(field.min, 'Too short!')
          }

          if (field.max) {
            validationField = validationField.max(field.max, 'Too long!')
          }

          validationField = validationField.nullable()

          validationFields[field.name] = validationField
        })

        return Yup.object().shape({ ...validationFields, ...validationSchema })
      }}
      onSubmit={(values, { resetForm }) => {
        values = { ...values }
        fields.forEach(field => {
          if (field.hasOwnProperty('onSubmitValue')) {
            if (typeof field.onSubmitValue === 'function') {
              if (field.hasOwnProperty('onSubmitKey')) {
                values[field.onSubmitKey] = field.onSubmitValue(values[field.name], values)
                delete values[field.name]
              } else {
                values[field.name] = field.onSubmitValue(values[field.name], values)
              }
            }
          }
          if (field.hasOwnProperty('disabled')) {
            if (field.disabled) {
              delete values[field.name]
            }
          }
        })
        mutate({
          url,
          data: values,
          method,
          params,
          onSuccess: data => {
            onSuccess(get(data, 'data'), resetForm)
          },
          onError: data => {
            onError(data)
          }
        })
      }}
    >
      {({
        handleSubmit,
        submitForm,
        values,
        isSubmitting,
        setFieldValue,
        setFieldError,
        setFieldTouched,
        touched,
        errors,
      }) => {
        return (
          <form
            onSubmit={handleSubmit}
            id={formid}
            onKeyPress={event => {
              // if (event.which === 13 && disableOnEnter) {
              // 	event.preventDefault();
              // }
            }}
          >
            {children({
              handleSubmit,
              submitForm,
              values,
              isSubmitting,
              setFieldValue,
              setFieldError,
              setFieldTouched,
              isSuccess,
              isLoading,
              errors,
              touched
            })}
          </form>
        )
      }}
    </Formik>
  )
}

export default Main
