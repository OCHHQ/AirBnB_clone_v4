$(document).ready(function () {
  const amenityIds = {};
  const stateCityObject = {};

  // Listen to changes on amenity checkboxes
  $('input[type="checkbox"].amenity').click(function () {
    const dataId = $(this).data('id');
    const dataName = $(this).data('name');
    if ($(this).is(':checked')) {
      amenityIds[dataId] = dataName;
    } else {
      delete amenityIds[dataId];
    }
    $('div.amenities h4').text(Object.values(amenityIds).join(', '));
  });

  // Listen to changes on state/city checkboxes
  $('input[type="checkbox"].location').click(function () {
    const dataId = $(this).data('id');
    const dataName = $(this).data('name');
    if ($(this).is(':checked')) {
      stateCityObject[dataId] = dataName;
    } else {
      delete stateCityObject[dataId];
    }
    $('div.locations h4').text(Object.values(stateCityObject).join(', '));
  });

  // Check API status
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
    if (textStatus === 'success' && data.status === 'OK') {
      $('#api_status').addClass('available').removeClass('notAvailable');
    } else {
      $('#api_status').addClass('notAvailable').removeClass('available');
    }
  });

  // Initial load of places
  fosterForImaginaryFriends();

  // Load places on button click with selected filters
  $('button').click(function () {
    const data = {
      amenities: Object.keys(amenityIds),
      states: Object.keys(stateCityObject).filter(id => $(`input[data-id="${id}"]`).hasClass('state')),
      cities: Object.keys(stateCityObject).filter(id => $(`input[data-id="${id}"]`).hasClass('city'))
    };
    fosterForImaginaryFriends(data);
  });

  // Toggle reviews on span click
  $('span.toggle-reviews').click(function () {
    const $this = $(this);
    const placeId = $this.data('id');
    if ($this.text() === 'show') {
      fetchAndDisplayReviews(placeId, $this);
    } else {
      hideReviews($this);
    }
  });

  function placeArticle (data) {
    const $placesSection = $('section.places');
    $placesSection.empty();
    for (const place of data) {
      const article = $('<article></article>');
      article.append(`<div class="title_box"><h2>${place.name}</h2><div class="price_by_night">$${place.price_by_night}</div></div>`);
      article.append(`
        <div class="information">
          <div class="max_guest">${place.max_guest} ${place.max_guest === 1 ? 'Guest' : 'Guests'}</div>
          <div class="number_rooms">${place.number_rooms} ${place.number_rooms === 1 ? 'Bedroom' : 'Bedrooms'}</div>
          <div class="number_bathrooms">${place.number_bathrooms} ${place.number_bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</div>
        </div>`);
      article.append(`<div class="description">${place.description}</div>`);
      article.append(`<div class="reviews"><h2>Reviews <span class="toggle-reviews" data-id="${place.id}">show</span></h2></div>`);
      $placesSection.append(article);
    }
  }

  function fosterForImaginaryFriends (dictionary = {}) {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      data: JSON.stringify(dictionary),
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      success: function (data) {
        placeArticle(data);
      }
    });
  }

  function fetchAndDisplayReviews (placeId, $toggleSpan) {
    $.get(`http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`, function (data, textStatus) {
      if (textStatus === 'success') {
        const reviewsDiv = $toggleSpan.closest('.reviews');
        for (const review of data) {
          const reviewElement = `<div class="review"><h3>From ${review.user_name} on ${review.created_at}</h3><p>${review.text}</p></div>`;
          reviewsDiv.append(reviewElement);
        }
        $toggleSpan.text('hide');
      }
    });
  }

  function hideReviews ($toggleSpan) {
    $toggleSpan.closest('.reviews').find('.review').remove();
    $toggleSpan.text('show');
  }
});
