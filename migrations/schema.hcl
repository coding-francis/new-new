schema "public" {
    comment = "standard public schema"
}

table "users" {
    schema = schema.public
    column "id" {
        type = bigint
        null = false
    }

    column "name" {
        null = true
        type = character_varying
    }

    column "email" {
        null = false
        type = character_varying
    }

    column "password" {
        null = false
        type = character_varying
    }

    primary_key {
        columns = [column.id]
    }
}