-- Does leroux.johannes@gmail.com exist as a user, and is the profile admin?
select u.id,
       u.email,
       p.is_admin,
       p.name,
       (p.id is null) as profile_missing
  from auth.users u
  left join public.profiles p on p.id = u.id
 where u.email = 'leroux.johannes@gmail.com';
