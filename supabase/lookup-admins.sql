-- Identify the ONE unknown admin account the user asked about (not Johannes,
-- whose id 9cfefc9c… is already confirmed). Single known-id lookup, not a sweep.
select u.id,
       u.email,
       u.created_at::date     as joined,
       u.last_sign_in_at::date as last_seen,
       p.name
  from public.profiles p
  join auth.users u on u.id = p.id
 where p.id = '60e950e9-ab33-4327-9163-b846c3648381';
