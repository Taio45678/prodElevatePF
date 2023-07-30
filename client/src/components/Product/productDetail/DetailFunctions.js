export function prom(rating) {
  if (!Array.isArray(rating) || rating.length === 0) {
    return 0;
  }

  let i = 0;
  let summ = 0;
  while (i < rating.length) {
    summ = summ + rating[i++];
  }
  return Math.round(summ / rating.length);
}


export function validate(input) {
  const errors = {};

  if (!input.qualification) {
    errors.qualification = 'La valoración es requerida';
  }
  if (input.review?.split(' ').length < 5) {
    errors.review = 'Debes dejar al menos un texto con 5 palabras';
  }

  return errors;
}

export function validateQuest(input) {
  const errors = {};
  if (!input.question) {
    errors.question = 'Debes dejar una pregunta';
  }

  return errors;
}