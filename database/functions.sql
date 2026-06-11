pg_get_functiondef
"CREATE OR REPLACE FUNCTION public.calculate_prediction_points(p_home integer, p_away integer, a_home integer, a_away integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
declare
  points integer := 0;
begin
  if p_home is null or p_away is null then
    return 0;
  end if;

  -- correct outcome
  if (
    (p_home > p_away and a_home > a_away)
    or
    (p_home = p_away and a_home = a_away)
    or
    (p_home < p_away and a_home < a_away)
  ) then
    points := points + 1;
  end if;

  -- correct home goals
  if p_home = a_home then
    points := points + 1;
  end if;

  -- correct away goals
  if p_away = a_away then
    points := points + 1;
  end if;

  -- exact score bonus
  if p_home = a_home and p_away = a_away then
    points := points + 1;
  end if;

  return points;
end;
$function$
"
"CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (
    id,
    display_name,
    preferred_lang
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', ''),
    coalesce(new.raw_user_meta_data->>'preferred_lang', 'en')
  );

  return new;
end;
$function$
"
"CREATE OR REPLACE FUNCTION public.is_prediction_exact(p_home integer, p_away integer, a_home integer, a_away integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
begin
  return (
    p_home = a_home
    and
    p_away = a_away
  );
end;
$function$
"
"CREATE OR REPLACE FUNCTION public.is_prediction_result_correct(p_home integer, p_away integer, a_home integer, a_away integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
begin
  return (
    (p_home > p_away and a_home > a_away)
    or
    (p_home = p_away and a_home = a_away)
    or
    (p_home < p_away and a_home < a_away)
  );
end;
$function$
"
"CREATE OR REPLACE FUNCTION public.prevent_locked_prediction_changes()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  round_lock_time timestamptz;
begin
  select r.lock_time
  into round_lock_time
  from matches m
  join rounds r
    on m.round_id = r.id
  where m.id = new.match_id;

  if
    now() > round_lock_time
    and (
      old.predicted_home is distinct from new.predicted_home
      or old.predicted_away is distinct from new.predicted_away
    )
  then
    raise exception 'Predictions are locked for this round';
  end if;

  return new;
end;
$function$
"
"CREATE OR REPLACE FUNCTION public.score_completed_match()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if new.is_complete = true then

    update predictions
    set
      points_awarded = calculate_prediction_points(
        predicted_home,
        predicted_away,
        new.home_score,
        new.away_score
      ),

      is_exact = is_prediction_exact(
        predicted_home,
        predicted_away,
        new.home_score,
        new.away_score
      ),

      is_correct_result = is_prediction_result_correct(
        predicted_home,
        predicted_away,
        new.home_score,
        new.away_score
      )

    where match_id = new.id;

  end if;

  return new;
end;
$function$
"
"CREATE OR REPLACE FUNCTION public.score_prediction_on_save()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  match_home integer;
  match_away integer;
  match_complete boolean;
begin

  select
    home_score,
    away_score,
    is_complete
  into
    match_home,
    match_away,
    match_complete
  from matches
  where id = new.match_id;

  if match_complete = true then

    new.points_awarded := calculate_prediction_points(
      new.predicted_home,
      new.predicted_away,
      match_home,
      match_away
    );

    new.is_exact := is_prediction_exact(
      new.predicted_home,
      new.predicted_away,
      match_home,
      match_away
    );

    new.is_correct_result := is_prediction_result_correct(
      new.predicted_home,
      new.predicted_away,
      match_home,
      match_away
    );

  end if;

  return new;
end;
$function$
"