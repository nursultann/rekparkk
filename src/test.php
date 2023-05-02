<?php

// -----------------------
class Advertisement extends Model {
    /**
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     **/
    public function customAttributeValues()
    {
        return $this->hasMany(CustomAttributeValue::class, 'advertisement_id');
    }
}
// -----------------------
class CustomAttributeValue extends Model
{
    /**
     * @return BelongsTo
     **/
    public function customAttribute(): BelongsTo
    {
        return $this->belongsTo(CustomAttribute::class, 'attribute_id');
    }
}
// -----------------------
class CustomAttribute extends Model
{
    
}
// -----------------------
class FilterByAttributesCriteria implements CriteriaInterface
{
    private $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    /**
     * Apply criteria in query repository
     *
     * @param Advertisement $model
     * @param RepositoryInterface $repository
     *
     * @return mixed
     */
    public function apply($model, RepositoryInterface $repository)
    {
       if ($this->request->has('filter_attributes')) {
           $filters = json_decode($this->request->input('filter_attributes'), true);
           $filters = array_filter($filters, function($value) { return !empty($value); });

           return $model->get()->filter(function($item) use ($filters) {
               $filterKeys = array_keys($filters);

               if (in_array('price_from', $filterKeys)
                   || in_array('price_to', array_keys($filters))
                   || in_array('currency_id', $filterKeys)) {
                   $data = $filters;
                   $priceFrom = $data['price_from'] ?? null;
                   $priceTo = $data['price_to'] ?? null;
                   $currencyId = $data['currency_id'] ?? null;

                   unset($data['price_from']);
                   unset($data['price_to']);
                   unset($data['currency_id']);

                   if (($currencyId && $item->currency_id != $currencyId)
                       || ($priceFrom &&  $item->price < $priceFrom)
                       || ($priceTo && $item->price > $priceTo)) {
                       return false;
                   }

                   if (!count($data)) {
                       return $item;
                   }
               }

               foreach($item->customAttributeValues as $attributeValue) {
                   $attributeName = $attributeValue->customAttribute->name;
                   if (in_array($attributeName, array_keys($filters)) && $filters[$attributeName] === $attributeValue->value) {
                       return $item;
                   }
               }

               return false;
           })->values();
       } else {
           return $model;
       }
    }
}