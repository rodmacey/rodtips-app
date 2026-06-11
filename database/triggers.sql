-- matches

create trigger trigger_score_completed_match
after update on matches
for each row
execute function score_completed_match();

-- predictions

create trigger trigger_prevent_locked_prediction_changes
before update on predictions
for each row
execute function prevent_locked_prediction_changes();

create trigger trigger_score_prediction_on_save
before insert or update on predictions
for each row
execute function score_prediction_on_save();